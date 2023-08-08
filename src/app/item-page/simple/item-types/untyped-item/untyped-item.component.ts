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
  }

  archivo() {
    this.bitstreamDataService.findAllByItemAndBundleName(this.object, 'ORIGINAL', {}).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.errorMessage) {
        this.notificationsService.error(this.translateService.get('file-section.error.header'), `${bitstreamsRD.statusCode} ${bitstreamsRD.errorMessage}`);
      } else if (hasValue(bitstreamsRD.payload)) {
        console.log(JSON.stringify(bitstreamsRD.payload.page))
        this.bitstreamsOriginal = bitstreamsRD.payload.page;
      }
    });
  }

}
