import {AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
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
import {MapComponent} from "ng-leaflet-universal";
import {Marker} from "ng-leaflet-universal/lib/models/marker.interface";

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit, AfterViewInit {
  @Input() object: Item;


  @ViewChild(MapComponent) mapComponent: MapComponent;
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
  markers: Marker = null;

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


      this.markers = {
        id: "abc123",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=",
        location: {
          latitude: this.latitud,
          longitude:  this.longitud,
        },
      };
    }
  }

  ngAfterViewInit(): void {
    this.mapComponent.updateMarkers([this.markers]);
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
        this.bitstreamsOriginal = bitstreamsRD.payload.page;
      }
    });
  }

}
