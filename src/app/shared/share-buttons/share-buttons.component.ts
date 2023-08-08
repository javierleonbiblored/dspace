import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'ds-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss']
})
export class ShareButtonsComponent{

  linkpage: string;
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if (isPlatformBrowser(this._platformId)) {
      this.linkpage = window.location.href;
    }
  }
}
