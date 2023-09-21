import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DSpaceObject} from '../../core/shared/dspace-object.model';
import {ActivatedRoute, Router} from '@angular/router';
import {isNotEmpty} from '../empty.util';
import {SearchService} from '../../core/shared/search/search.service';
import {currentPath} from '../utils/route.utils';
import {PaginationService} from '../../core/pagination/pagination.service';
import {SearchConfigurationService} from '../../core/shared/search/search-configuration.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ScopeSelectorModalComponent} from './scope-selector-modal/scope-selector-modal.component';
import {take} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {DSpaceObjectDataService} from '../../core/data/dspace-object-data.service';
import {getFirstSucceededRemoteDataPayload} from '../../core/shared/operators';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html'
})

/**
 * Component that represents the search form
 */
export class SearchFormComponent implements OnInit {
  /**
   * The search query
   */
  @Input() query: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  selectedScope: BehaviorSubject<DSpaceObject> = new BehaviorSubject<DSpaceObject>(undefined);

  @Input() currentUrl: string;

  /**
   * Whether or not the search button should be displayed large
   */
  @Input() large = false;

  /**
   * The brand color of the search button
   */
  @Input() brandColor = 'primary';

  /**
   * The placeholder of the search input
   */
  @Input() searchPlaceholder: string;

  /**
   * Defines whether or not to show the scope selector
   */
  @Input() showScopeSelector = false;

  /**
   * Output the search data on submit
   */
  @Output() submitSearch = new EventEmitter<any>();

  tipo = 'f.author';

  condicion = 'contains';

  habilitarBusquedaAvanzada: boolean = false;


  formularioBusquedaAvanzada: FormGroup;

  constructor(private router: Router,
              private searchService: SearchService,
              private paginationService: PaginationService,
              private searchConfig: SearchConfigurationService,
              private modalService: NgbModal,
              private dsoService: DSpaceObjectDataService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
  ) {
    this.crearFormulario();
    this.activatedRoute.snapshot.queryParamMap.getAll('f.author').forEach((value, index) => {
      this.anadirBusqueda('f.author', value.slice(value.search(',') + 1), value.slice(0, value.search(',')));
      this.habilitarBusquedaAvanzada = true
    });

    this.activatedRoute.snapshot.queryParamMap.getAll('f.subject').forEach((value, index) => {
      this.anadirBusqueda('f.subject', value.slice(value.search(',') + 1), value.slice(0, value.search(',')));
      this.habilitarBusquedaAvanzada = true
    });

    this.activatedRoute.snapshot.queryParamMap.getAll('f.title').forEach((value, index) => {
      this.anadirBusqueda('f.title', value.slice(value.search(',') + 1), value.slice(0, value.search(',')));
      this.habilitarBusquedaAvanzada = true
    });
  }

  /**
   * Retrieve the scope object from the URL so we can show its name
   */
  ngOnInit(): void {
    if (isNotEmpty(this.scope)) {
      this.dsoService.findById(this.scope).pipe(getFirstSucceededRemoteDataPayload())
        .subscribe((scope: DSpaceObject) => this.selectedScope.next(scope));
    }
  }

  crearFormulario() {
    this.formularioBusquedaAvanzada = this.fb.group({
      busquedaAvanzada: this.fb.array([])
    });
  }

  get busquedaAvanzadaArray(): FormArray {
    return this.formularioBusquedaAvanzada.get('busquedaAvanzada') as FormArray;
  }

  anadirBusqueda(tipo?: string, condicion?: string, busqueda?: string) {
    const busquedaForm = this.fb.group({
      tipo: new FormControl(tipo ?? 'f.author',),
      condicion: new FormControl(condicion ?? 'contains'),
      busqueda: new FormControl(busqueda ?? '')
    });
    this.busquedaAvanzadaArray.push(busquedaForm);
  }

  restablecerBusqueda() {
    this.crearFormulario();
    console.log(this.formularioBusquedaAvanzada.value)
    this.onChangeBuscador();
    this.habilitarBusquedaAvanzada = false;
  }

  borrarIndexBusqueda(indice: number) {
    this.busquedaAvanzadaArray.removeAt(indice);
    this.onChangeBuscador()
    if (this.busquedaAvanzadaArray.length === 0) {
      this.metodoHabilitarBusquedaAvanzada(false);
    }
  }


  metodoHabilitarBusquedaAvanzada(opcion: boolean): void {
    this.habilitarBusquedaAvanzada = opcion;
    if (!this.habilitarBusquedaAvanzada) {
      this.crearFormulario();
      this.onChangeBuscador()
    } else if (this.habilitarBusquedaAvanzada && this.busquedaAvanzadaArray.length < 1) {
      this.anadirBusqueda();
    }
  }

  onChangeBuscador(): void {
      let title = [];
      let author = [];
      let subject = [];
      this.busquedaAvanzadaArray.value.map((element) => {
        if (element.tipo === 'f.title') {
          title.push(element)
        } else if (element.tipo === 'f.author') {
          author.push(element)
        } else if (element.tipo === 'f.subject') {
          subject.push(element)
        }
      })

      this.router.navigate(this.getSearchLinkParts(),
        {
          queryParams: {
            'f.title': title.map((element) =>
              `${element.busqueda},${element.condicion}`
            ) ?? null,
            'f.author': author.map((element) =>
              `${element.busqueda},${element.condicion}`
            ) ?? null,
            'f.subject': subject.map((element) =>
              `${element.busqueda},${element.condicion}`
            ) ?? null,
            query: this.query,
            'spc.page': null,
          },
          queryParamsHandling: 'merge',
        })
  }

  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(data: any) {
    if (isNotEmpty(this.scope)) {
      data = Object.assign(data, {scope: this.scope});
    }
    this.updateSearch(data);
    this.submitSearch.emit(data);
  }


  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: DSpaceObject) {
    this.updateSearch({scope: scope ? scope.uuid : undefined});
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any) {
    const queryParams = Object.assign({}, data);

    this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  /**
   * For usage of the isNotEmpty function in the template
   */
  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  /**
   * Open the scope modal so the user can select DSO as scope
   */
  openScopeModal() {
    const ref = this.modalService.open(ScopeSelectorModalComponent);
    ref.componentInstance.scopeChange.pipe(take(1)).subscribe((scope: DSpaceObject) => {
      this.selectedScope.next(scope);
      this.onScopeChange(scope);
    });
  }
}
