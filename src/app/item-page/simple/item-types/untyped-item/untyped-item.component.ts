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
  pdfSrc: string | Blob = 'https://api7.dspace.org/server/api/core/bitstreams/67e561e7-6bfd-4e25-9c13-8cdf9f827a92/content';
  logLevel = VerbosityLevel.ERRORS;

  ngOnInit() {
    console.log('------------------------------ this.object----------------------')
    console.log(JSON.stringify(this.object.thumbnail))
  }
}
