import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Item} from '../../../../core/shared/item.model';
import {ViewMode} from '../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import {ItemComponent} from '../shared/item.component';
import {VerbosityLevel} from 'ngx-extended-pdf-viewer';

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
  linkpage: string;
  pdfSrc = 'https://apimarketplace.demopolys.com/api/marketplace/media/public/getMedia/privacypolicy.pdf';

  ngOnInit() {
    this.linkpage = window.location.href;
  }
}
