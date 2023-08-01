import {ChangeDetectionStrategy, Component, Inject, OnInit, Output, SimpleChanges} from '@angular/core';
import {Item} from '../../../../core/shared/item.model';
import {ViewMode} from '../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import {ItemComponent} from '../shared/item.component';
import {VerbosityLevel} from 'ngx-extended-pdf-viewer';
import {BehaviorSubject, Observable} from "rxjs";
import {Bitstream} from "../../../../core/shared/bitstream.model";
import {getFirstCompletedRemoteData} from "../../../../core/shared/operators";
import {RemoteData} from "../../../../core/data/remote-data";
import {PaginatedList} from "../../../../core/data/paginated-list.model";
import {hasValue} from "../../../../shared/empty.util";
import {BitstreamDataService} from "../../../../core/data/bitstream-data.service";
import {NotificationsService} from "../../../../shared/notifications/notifications.service";
import {TranslateService} from "@ngx-translate/core";
import {APP_CONFIG, AppConfig} from "../../../../../config/app-config.interface";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteService} from "../../../../core/services/route.service";

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends ItemComponent implements OnInit {
 /* pdfSrc: string | Blob = 'https://api7.dspace.org/server/api/core/bitstreams/67e561e7-6bfd-4e25-9c13-8cdf9f827a92/content';
  audio: string = 'https://api7.dspace.org/server/api/core/bitstreams/57633e7d-a7d3-41d5-be9b-5d9a3792abb9/content';
  video: string = 'https://api7.dspace.org/server/api/core/bitstreams/fb46e81f-a312-418f-bab5-c13fd63ee604/content'*/
  logLevel = VerbosityLevel.ERRORS;
  bitstreamsOriginal: Bitstream[];

  constructor(
    protected routeService: RouteService,
    protected router: Router,
    public bitstreamDataService: BitstreamDataService,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
  ) {
    super(routeService, router);
  }

  ngOnInit(): void {
    this.archivo();

    console.log('++++++++++++++++++++++++++++++++++++++++++++++++++');
    console.log(JSON.stringify(this.object));
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
