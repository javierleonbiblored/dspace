import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'ds-type-content',
  templateUrl: './type-content.component.html',
  styleUrls: ['./type-content.component.scss']
})
export class TypeContentComponent implements OnInit {

  constructor(
    protected router: Router,
  ) { }

  ngOnInit(): void {
  }

  viewPage(value: string): void {
    this.router.navigate(['/search'], {queryParams: {query: 'dc.type:' + value}});
  }

}
