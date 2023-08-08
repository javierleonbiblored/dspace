import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'ds-frequent-questions',
  templateUrl: './frequent-questions.component.html',
  styleUrls: ['./frequent-questions.component.scss']
})
export class FrequentQuestionsComponent implements OnInit {

  href = false;

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.href = window.location.href.endsWith('frequent-questions');
    }
  }


}
