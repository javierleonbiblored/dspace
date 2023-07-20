import { Component, OnInit } from '@angular/core';
import {VerbosityLevel} from "ngx-extended-pdf-viewer";

@Component({
  selector: 'ds-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss']
})
export class ShareButtonsComponent implements OnInit {

  linkpage: string;
  constructor() { }

  ngOnInit(): void {
    this.linkpage = window.location.href;
  }

}
