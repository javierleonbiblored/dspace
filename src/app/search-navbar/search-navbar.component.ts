import {Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {SearchService} from '../core/shared/search/search.service';
import {expandSearchInput} from '../shared/animations/slide';
import {isPlatformBrowser} from "@angular/common";
declare let webkitSpeechRecognition: any;
/**
 * The search box in the header that expands on focus and collapses on focus out
 */
@Component({
  selector: 'ds-search-navbar',
  templateUrl: './search-navbar.component.html',
  styleUrls: ['./search-navbar.component.scss'],
  animations: [expandSearchInput]
})
export class SearchNavbarComponent {

  // The search form
  searchForm;
  // Whether or not the search bar is expanded, boolean for html ngIf, string fo AngularAnimation state change
  searchExpanded = false;
  isExpanded = 'collapsed';

  // Search input field
  @ViewChild('searchInput') searchField: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private searchService: SearchService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
  }


  reconocimientoVoz(): void {
      const voz = new webkitSpeechRecognition();
      voz.lang = "es-ES";
      voz.start();
      voz.addEventListener("result", evento => {
        // console.log(evento.results)
        this.searchForm = this.formBuilder.group(({
          query: evento.results[0][0].transcript,
        }));
        this.onSubmit(this.searchForm.value)
      })
  }


  /**
   * Expands search bar by angular animation, see expandSearchInput
   */
  expand() {
    this.searchExpanded = true;
    this.isExpanded = 'expanded';
    this.editSearch();
  }

  /**
   * Collapses & blurs search bar by angular animation, see expandSearchInput
   */
  collapse() {
    this.searchField.nativeElement.blur();
    this.searchExpanded = false;
    this.isExpanded = 'collapsed';
  }

  /**
   * Focuses on input search bar so search can be edited
   */
  editSearch(): void {
    this.searchField.nativeElement.focus();
  }

  /**
   * Submits the search (on enter or on search icon click)
   * @param data  Data for the searchForm, containing the search query
   */
  onSubmit(data: any) {
    this.collapse();
    data.query = this.quitarEspacios(data.query)
    const queryParams = Object.assign({}, data);
    const linkToNavigateTo = [this.searchService.getSearchLink().replace('/', '')];
    this.searchForm.reset();

    this.router.navigate(linkToNavigateTo, {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  quitarEspacios(text: string): string {
    const expRegular = /(\s{2,})/g;
    text = text.trim();
    text = text.replace(expRegular, " ").toString()
    console.log('********************* quitarEspacios Buscador navbar Salida  ************************')
    console.log(text)
    return text;
  }
}
