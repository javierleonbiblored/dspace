import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Item} from '../../../../core/shared/item.model';
import {ViewMode} from '../../../../core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import {ItemComponent} from '../shared/item.component';
import {Observable} from "rxjs";
import {RemoteData} from "../../../../core/data/remote-data";

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

  visibleModal: boolean = false;
  title = "CodeSandbox";
  imageIndex = 0;
  images = [
    "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg"
  ];

  visualizarImagen(href: string): void {
    this.images = [
      "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg"
    ];
  }

  config = {
    containerBackgroundColor: '#fff', // The color to use for the background. This can provided in hex, or rgb(a).
    btnClass: 'default',
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
         next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
       next: true,
        prev: true
    },
  };
  enviarUrl(value: string, creador: boolean, tema: boolean) {
    if (tema){
      this.router.navigate(['/search'], { queryParams: { query: 'dc.subject:' + value } });
    }
    if (creador){
      this.router.navigate(['/search'], { queryParams: { query: 'dc.creator:' + value } });
    }
  }

}
