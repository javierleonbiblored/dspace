import {ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {PaginatedSearchOptions} from '../../shared/search/models/paginated-search-options.model';
import {fadeIn, fadeInOut} from '../../shared/animations/fade';
import {RemoteData} from '../../core/data/remote-data';
import {PaginatedList} from '../../core/data/paginated-list.model';
import {Item} from '../../core/shared/item.model';
import {PaginationComponentOptions} from '../../shared/pagination/pagination-component-options.model';
import {PaginationService} from '../../core/pagination/pagination.service';
import {SearchService} from '../../core/shared/search/search.service';
import {SortDirection, SortOptions} from '../../core/cache/models/sort-options.model';
import {environment} from '../../../environments/environment';
import {ViewMode} from '../../core/shared/view-mode.model';
import {SearchConfigurationService} from '../../core/shared/search/search-configuration.service';
import {toDSpaceObjectListRD} from '../../core/shared/operators';
import {Observable} from 'rxjs';
import {followLink, FollowLinkConfig} from '../../shared/utils/follow-link-config.model';
import {APP_CONFIG, AppConfig} from '../../../config/app-config.interface';
import {isPlatformBrowser} from '@angular/common';
import {setPlaceHolderAttributes} from '../../shared/utils/object-list-utils';
import {DSpaceObjectType} from '../../core/shared/dspace-object-type.model';
import {Router} from "@angular/router";
import {Carrusel, XmlCarruseles} from "../home-news/tb_xmltoJson.type";
import {NgxXml2jsonService} from "ngx-xml2json";
import {HttpClient} from "@angular/common/http";
import {Coleccion, XmlColecciones} from "./tb_xmltoJson.type";

@Component({
  selector: 'ds-recent-item-list',
  templateUrl: './recent-item-list.component.html',
  styleUrls: ['./recent-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class RecentItemListComponent implements OnInit {
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;

  /**
   * The view-mode we're currently on
   * @type {ViewMode}
   */
  viewMode = ViewMode.ListElement;

  private _placeholderFontClass: string;

  xmltoJsonCarrusel: XmlColecciones;
  dataXmlCarrusel: Coleccion[]
  constructor(
    private searchService: SearchService,
    private paginationService: PaginationService,
    public searchConfigurationService: SearchConfigurationService,
    protected elementRef: ElementRef,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ngxXml2jsonService: NgxXml2jsonService,
    private httpClient: HttpClient
  ) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'hp',
      pageSize: environment.homePage.recentSubmissions.pageSize,
      currentPage: 1,
      maxSize: 1
    });
    this.sortConfig = new SortOptions(environment.homePage.recentSubmissions.sortField, SortDirection.DESC);
  }

  ngOnInit(): void {
    const linksToFollow: FollowLinkConfig<Item>[] = [];
    if (this.appConfig.browseBy.showThumbnails) {
      linksToFollow.push(followLink('thumbnail'));
    }

    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
      }),
      undefined,
      undefined,
      undefined,
      ...linksToFollow,
    ).pipe(
      toDSpaceObjectListRD()
    ) as Observable<RemoteData<PaginatedList<Item>>>;
    this.loadXML();
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

  onLoadMore(): void {
    this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, ['search'], {
      sortField: environment.homePage.recentSubmissions.sortField,
      sortDirection: 'DESC' as SortDirection,
      page: 1
    });
  }

  get placeholderFontClass(): string {
    if (this._placeholderFontClass === undefined) {
      if (isPlatformBrowser(this.platformId)) {
        const width = this.elementRef.nativeElement.offsetWidth;
        this._placeholderFontClass = setPlaceHolderAttributes(width);
      } else {
        this._placeholderFontClass = 'hide-placeholder-text';
      }
    }
    return this._placeholderFontClass;
  }

  viewPage() {
    this.router.navigate(['/community-list'])
  }

  loadXML(): void {
    this.httpClient.get('assets/colecciones/colecciones.xml', {responseType: 'text'})
      .subscribe((data: string) => {
        this.colecciones(data);
      });
  }

  colecciones(data): void {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    this.xmltoJsonCarrusel = this.ngxXml2jsonService.xmlToJson(xml) as XmlColecciones;
    this.dataXmlCarrusel = this.xmltoJsonCarrusel.colecciones.coleccion;
    console.log(this.dataXmlCarrusel)
  }

  viewPageDestino(url): void{
    window.open(url)
  }

}

