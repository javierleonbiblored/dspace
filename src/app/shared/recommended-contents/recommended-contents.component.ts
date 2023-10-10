import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Observable} from "rxjs";
import {RemoteData} from "../../core/data/remote-data";
import {PaginatedList} from "../../core/data/paginated-list.model";
import {Item} from "../../core/shared/item.model";
import {PaginatedSearchOptions} from "../search/models/paginated-search-options.model";
import {DSpaceObjectType} from "../../core/shared/dspace-object-type.model";
import {toDSpaceObjectListRD} from "../../core/shared/operators";
import {SearchService} from "../../core/shared/search/search.service";
import {PaginationComponentOptions} from "../pagination/pagination-component-options.model";
import {SortDirection, SortOptions} from "../../core/cache/models/sort-options.model";
import {environment} from "../../../environments/environment";
import {followLink, FollowLinkConfig} from "../utils/follow-link-config.model";
import {APP_CONFIG, AppConfig} from "../../../config/app-config.interface";
import {Bitstream} from "../../core/shared/bitstream.model";
import {isPlatformBrowser} from "@angular/common";
import value from "*.json";

@Component({
  selector: 'ds-recommended-contents',
  templateUrl: './recommended-contents.component.html',
  styleUrls: ['./recommended-contents.component.scss']
})
export class RecommendedContentsComponent implements OnInit {
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;

  constructor(
    private searchService: SearchService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(PLATFORM_ID) private _platformId: Object
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
    this.itemRD$.subscribe(value => {
      let items: Item[] = value.payload.page
      /* console.log(JSON.stringify(value.payload.page))*/
      let itemValue: Item = items[1]
      console.log(JSON.stringify(items))
      //  console.log(JSON.stringify(items[0]?._links));
      // console.log(JSON.stringify(items[0]?._links?.thumbnail?.href));
    })
  }

  abrirLink(urls): void{
    console.log(JSON.stringify(urls))
    urls.map(url => {
      if (url.value.includes('handle/')){
        if (isPlatformBrowser(this._platformId)) {
          window.open(url.value, "_blank");
        }
      }
    })
  }
}
