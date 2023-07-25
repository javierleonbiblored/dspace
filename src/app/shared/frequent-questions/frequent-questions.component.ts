import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ds-frequent-questions',
  templateUrl: './frequent-questions.component.html',
  styleUrls: ['./frequent-questions.component.scss']
})
export class FrequentQuestionsComponent implements OnInit {

  href = false;
  constructor() { }

  ngOnInit(): void {
    this.href = window.location.href.endsWith('frequent-questions');
  }

}
