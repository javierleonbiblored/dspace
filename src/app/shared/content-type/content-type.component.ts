import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'ds-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) { }

  ngOnInit(): void {
    /*if (isPlatformBrowser(this._platformId)) {
      new Promise(function(resolve) {
        setTimeout(resolve, 5000);
      }).then(function() {
        document.getElementById('carouselTemasWeb')?.click();
        document.getElementById('carouselTemasMovil')?.click();
      });
    }*/
  }

}
