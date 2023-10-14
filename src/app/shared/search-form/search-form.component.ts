import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {DSpaceObject} from '../../core/shared/dspace-object.model';
import {ActivatedRoute, Router} from '@angular/router';
import {hasValue, isNotEmpty} from '../empty.util';
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
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {lowerFirst} from "lodash";

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

    /*Query*/
    formularioBusquedaAvanzadaQuery: FormGroup;

    queryBusquedaAvanzada: string = '';


    constructor(private router: Router,
                private searchService: SearchService,
                private paginationService: PaginationService,
                private searchConfig: SearchConfigurationService,
                private modalService: NgbModal,
                private dsoService: DSpaceObjectDataService,
                private fb: FormBuilder,
                private activatedRoute: ActivatedRoute,
    ) {
        if (window.location.pathname.includes('/collections/')) {
            this.activatedRoute.paramMap.pipe().subscribe(params => {
                this.router.navigate([window.location.pathname],
                    {
                        queryParams: {
                            scope: params.get('id'),
                        },
                        queryParamsHandling: 'merge',
                    })
            });
        }

        /*Query*/
        this.crearFormularioQuery();
    }

    ngOnInit(): void {
        if (isNotEmpty(this.scope)
        ) {
            this.dsoService.findById(this.scope).pipe(getFirstSucceededRemoteDataPayload())
                .subscribe((scope: DSpaceObject) => this.selectedScope.next(scope));
        }

        this.queryBusquedaAvanzada = 'buscador buscador NOT dc.creator:creator1 OR dc.title: title2.1 title2.2 AND dc.subject:subject3.1 subject3.2 subject3.3'
        if (this.queryBusquedaAvanzada.includes('dc.subject:') || this.queryBusquedaAvanzada.includes('dc.creator:') || this.queryBusquedaAvanzada.includes('dc.title:')) {
            // this.organizarPalabras( this.quitarEspacios(this.queryBusquedaAvanzada), ['dc.title:', 'dc.subject:', 'dc.creator:']);
            this.organizarPalabras(this.quitarEspacios(this.queryBusquedaAvanzada), ['dc.title:', 'dc.subject:', 'dc.creator:']);
            // this.habilitarBusquedaAvanzada = true;

        }
    }


    organizarPalabras(frase: string, palabra: string[]) {
        this.query = ''
        while (frase.includes(":")) {
            frase = frase.replace(":", " ");
        }
        let fraseArr = frase.replace(":", " ").split(" ");
        console.log(fraseArr)
        let encontroQuery: boolean = false;
        let palabrasBuscadorAvanzadoBoolean: boolean = false;

        let arrayBase = {
            tipo: null,
            condicion: null,
            busqueda: null,
        }
        for (let i = 0; i <= fraseArr.length; i++) {
            // encontrar el query


            // dc.subject
            // dc.title
            // dc.creator
            if ((fraseArr[i] === "AND" || fraseArr[i] === "OR" || fraseArr[i] === "NOT" ||
                fraseArr[i] === "dc.subject" || fraseArr[i] === "dc.title" || fraseArr[i] === "dc.creator")) {
                encontroQuery = true
            }

            if ((!(fraseArr[i] === "AND") || !(fraseArr[i] === "OR") || !(fraseArr[i] === "NOT") ||
                    !(fraseArr[i] === "dc.subject") || !(fraseArr[i] === "dc.title") || !(fraseArr[i] === "dc.creator")) &&
                !encontroQuery) {
                this.query = this.query + ' ' + fraseArr[i].toString();
            }

            // condicionQuery
            // tipoQuery
            // busquedaQuery

            if (encontroQuery) {
                console.log('***********************')
                if (!(fraseArr[i] === "AND") && !(fraseArr[i] === "OR") && !(fraseArr[i] === "NOT") && !(fraseArr[i] === "dc.")) {
                    //   console.log('Validador de palabrasBuscadorAvanzadoBoolean')
                    palabrasBuscadorAvanzadoBoolean = true;
                }

                if (fraseArr[i] === "AND" || fraseArr[i] === "OR" || fraseArr[i] === "NOT" ||
                    fraseArr[i] === "dc.subject" || fraseArr[i] === "dc.title" || fraseArr[i] === "dc.creator") {

                    // Agrgega la condicion AND OR o NOT
                    if ((fraseArr[i] === "AND" || fraseArr[i] === "OR" || fraseArr[i] === "NOT")) {
                        // console.log('Agrgega la condicion ------  ' + fraseArr[i])
                        arrayBase.condicion = fraseArr[i];
                        palabrasBuscadorAvanzadoBoolean = false;
                    }

                    // Agrgega la tipo dc.subject, dc.creator o dc.title
                    if (fraseArr[i] === "dc.subject" || fraseArr[i] === "dc.title" || fraseArr[i] === "dc.creator") {
                        // console.log('Agrgega la tipo -----  ' + fraseArr[i])
                        arrayBase.tipo = fraseArr[i];
                        palabrasBuscadorAvanzadoBoolean = false;
                    }

                    if (arrayBase.tipo !== null && arrayBase.condicion !== null && arrayBase.busqueda === null && palabrasBuscadorAvanzadoBoolean) {
                        console.log('------ 1111 anadirBusquedaQuery ------')
                        this.anadirBusquedaQuery(arrayBase.tipo, arrayBase.condicion, arrayBase.busqueda);
                        palabrasBuscadorAvanzadoBoolean = false;
                        arrayBase = {
                            tipo: null,
                            condicion: null,
                            busqueda: null,
                        }
                    }
                } else {
                    if (palabrasBuscadorAvanzadoBoolean) {
                        arrayBase.busqueda = this.quitarEspacios(arrayBase.busqueda === null ? '' : arrayBase.busqueda + ' ' + fraseArr[i]);
                    }

                    if (fraseArr.length === i) {
                        console.log('2.1 el que sigue es ---- ' + fraseArr[i + 1])
                        this.anadirBusquedaQuery(arrayBase.tipo, arrayBase.condicion, arrayBase.busqueda);
                        palabrasBuscadorAvanzadoBoolean = false;

                    } else if (fraseArr[i + 1] === "AND" || fraseArr[i + 1] === "OR" || fraseArr[i + 1] === "NOT" ||
                        fraseArr[i + 1] === "dc.subject" || fraseArr[i + 1] === "dc.title" || fraseArr[i + 1] === "dc.creator") {
                        console.log('2.2 el que sigue es ---- ' + fraseArr[i + 1])
                        this.anadirBusquedaQuery(arrayBase.tipo, arrayBase.condicion, arrayBase.busqueda);
                        palabrasBuscadorAvanzadoBoolean = false;
                        arrayBase = {
                            tipo: null,
                            condicion: null,
                            busqueda: null
                        }
                    }
                }


                // Agrgega la busqueda avanzada
                /*   if (palabrasBuscadorAvanzadoBoolean) {
                       // console.log('Agrgega la busqueda avanzada  -----  ' + fraseArr[i])
                   }*/

            }
        }
        // console.log(arrayBase)
        console.log(JSON.stringify(this.busquedaAvanzadaArrayQuery.value))
        this.habilitarBusquedaAvanzada = true;
    }


    /*Query*/
    crearFormularioQuery() {
        this.formularioBusquedaAvanzadaQuery = this.fb.group({
            busquedaAvanzadaArrayQuery: this.fb.array([])
        });
    }

    get busquedaAvanzadaArrayQuery(): FormArray {
        return this.formularioBusquedaAvanzadaQuery.get('busquedaAvanzadaArrayQuery') as FormArray;
    }


    anadirBusquedaQuery(tipo ?: string, condicion ?: string, busqueda ?: string) {
        const busquedaForm = this.fb.group({
            tipoQuery: new FormControl(tipo ?? 'dc.subject'),
            condicionQuery: new FormControl(condicion ?? ''),
            busquedaQuery: new FormControl(busqueda ?? '')
        });
        this.busquedaAvanzadaArrayQuery.push(busquedaForm);
    }

    restablecerBusquedaQuery() {
        this.crearFormularioQuery();
        this.query = '';
        this.queryBusquedaAvanzada = '';
        this.onChangeBuscadorQuery();
        this.habilitarBusquedaAvanzada = false;
    }


    borrarIndexBusquedaQuery(indice: number) {
        this.busquedaAvanzadaArrayQuery.removeAt(indice);
        this.onChangeBuscadorQuery()
        if (this.busquedaAvanzadaArrayQuery.length === 0) {
            this.metodoHabilitarBusquedaAvanzadaQuery(false);
        }
    }


    metodoHabilitarBusquedaAvanzadaQuery(opcion: boolean): void {
        this.habilitarBusquedaAvanzada = opcion;
        if (!this.habilitarBusquedaAvanzada) {
            this.crearFormularioQuery();
            this.onChangeBuscadorQuery()
        } else if (this.habilitarBusquedaAvanzada && this.busquedaAvanzadaArrayQuery.length < 1) {
            this.anadirBusquedaQuery();
        }
    }

    onChangeBuscadorQuery(): void {
        let title = [];
        let author = [];
        let subject = [];
        console.log(JSON.stringify(this.busquedaAvanzadaArrayQuery.value))

        this.queryBusquedaAvanzada = '';
        this.busquedaAvanzadaArrayQuery.value.map((element) => {

            this.queryBusquedaAvanzada = this.queryBusquedaAvanzada.toString().trim() + ' ' + element.condicionQuery.toString().trim() + ' ' + element.tipoQuery.toString().trim() + ':' + element.busquedaQuery.toString().trim();
        })
        this.quitarEspacios(this.query.toString() + ' ' + this.queryBusquedaAvanzada)
        /*this.router.navigate(this.getSearchLinkParts(),
          {
            queryParams: {
              query: this.quitarEspacios(this.query.toString() + this.queryBusquedaAvanzada),
              'spc.page': null,
            },
            queryParamsHandling: 'merge',
          })*/
    }

    quitarEspacios(text: string): string {
        const expRegular = /(\s{2,})/g;
        text = text.trim();
        text = text.replace(expRegular, " ").toString()
        return text;
    }


    /**
     * Updates the search when the form is submitted
     * @param data Values submitted using the form
     */
    onSubmit(data: any) {
        data.query = this.quitarEspacios(data.query)
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
