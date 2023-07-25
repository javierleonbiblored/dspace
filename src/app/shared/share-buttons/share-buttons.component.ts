import {Component, Inject, OnInit} from '@angular/core';
import {VerbosityLevel} from "ngx-extended-pdf-viewer";
import {NativeWindowRef, NativeWindowService} from "../../core/services/window.service";

@Component({
  selector: 'ds-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss']
})
export class ShareButtonsComponent{

  linkpage: string;
  constructor(@Inject(NativeWindowService) private _window: NativeWindowRef,
  ) {
    this.linkpage = this._window.nativeWindow.location.href;
  }
}
