import {Component, Inject, Input, OnInit, PLATFORM_ID} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Item} from '../../../../core/shared/item.model';
import {getItemPageRoute} from '../../../item-page-routing-paths';
import {RouteService} from '../../../../core/services/route.service';
import {Observable} from 'rxjs';
import {getDSpaceQuery, isIiifEnabled, isIiifSearchEnabled} from './item-iiif-utils';
import {filter, map, take} from 'rxjs/operators';
import {Router} from '@angular/router';
import {BitstreamDataService} from "../../../../core/data/bitstream-data.service";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";
import {TranslateService} from "@ngx-translate/core";
import {Bitstream} from "../../../../core/shared/bitstream.model";
import {getFirstCompletedRemoteData} from "../../../../core/shared/operators";
import {RemoteData} from "../../../../core/data/remote-data";
import {PaginatedList} from "../../../../core/data/paginated-list.model";
import {hasValue} from "../../../../shared/empty.util";
import {isPlatformBrowser} from "@angular/common";
import {VerbosityLevel} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * This regex matches previous routes. The button is shown
   * for matching paths and hidden in other cases.
   */
  previousRoute = /^(\/search|\/browse|\/collections|\/admin\/search|\/mydspace)/;

  /**
   * Used to show or hide the back to results button in the view.
   */
  showBackButton: Observable<boolean>;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  /**
   * Enables the mirador component.
   */
  iiifEnabled: boolean;

  /**
   * Used to configure search in mirador.
   */
  iiifSearchEnabled: boolean;

  /**
   * The query term from the previous dspace search.
   */
  iiifQuery$: Observable<string>;

  mediaViewer;


  longitud: number;

  latitud: number;

  logLevel = VerbosityLevel.ERRORS;

  bitstreamsOriginal: Bitstream[] = [];

  constructor(protected routeService: RouteService,
              protected router: Router,
              public bitstreamDataService: BitstreamDataService,
              public notificationsService: NotificationsService,
              public translateService: TranslateService,
              @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    this.mediaViewer = environment.mediaViewer;
  }

  /**
   * The function used to return to list from the item.
   */
  back = () => {
    this.routeService.getPreviousUrl().pipe(
      take(1)
    ).subscribe(
      (url => {
        this.router.navigateByUrl(url);
      })
    );
  };

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
    // hide/show the back button
    this.showBackButton = this.routeService.getPreviousUrl().pipe(
      filter(url => this.previousRoute.test(url)),
      take(1),
      map(() => true)
    );
    // check to see if iiif viewer is required.
    this.iiifEnabled = isIiifEnabled(this.object);
    this.iiifSearchEnabled = isIiifSearchEnabled(this.object);
    if (this.iiifSearchEnabled) {
      this.iiifQuery$ = getDSpaceQuery(this.object, this.routeService);
    }
    if (isPlatformBrowser(this._platformId)) {

      this.ubicacion();
      this.archivo();
    }
  }

  ubicacion(): void {
    this.longitud = parseFloat(this.object?.allMetadata('local.longitud')[0]?.value);
    this.latitud = parseFloat(this.object?.allMetadata('local.latitud')[0]?.value);
  }

  archivo() {
    this.bitstreamDataService.findAllByItemAndBundleName(this.object, 'ORIGINAL', {}).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.errorMessage) {
        this.notificationsService.error(this.translateService.get('file-section.error.header'), `${bitstreamsRD.statusCode} ${bitstreamsRD.errorMessage}`);
      } else if (hasValue(bitstreamsRD.payload)) {
        // console.log(JSON.stringify(bitstreamsRD.payload.page))
        this.bitstreamsOriginal = bitstreamsRD.payload.page;
        console.log(JSON.stringify(this.bitstreamsOriginal));
      }
    });
  }

}
