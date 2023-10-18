import {Component, OnInit} from '@angular/core';
import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'ds-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent implements OnInit{
  ngOnInit(): void {
     /*if (isPlatformBrowser(this._platformId)) {
      new Promise(function(resolve) {
        setTimeout(resolve, 5000);
      }).then(function() {
        document.getElementById('carouselExampleIndicator')?.click();
      });
     }*/
  }
}

