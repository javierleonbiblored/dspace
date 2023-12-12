import {Component, Inject, OnInit, PLATFORM_ID,} from '@angular/core';
import {NgxXml2jsonService} from 'ngx-xml2json';
import {Carrusel, Carruseles, XmlCarruseles} from "./tb_xmltoJson.type";
import {isPlatformBrowser} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'ds-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent{


  xmltoJson: XmlCarruseles;
  dataXml: Carrusel[]
  xml = ``;

  constructor(
    private ngxXml2jsonService: NgxXml2jsonService,
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private httpClient: HttpClient) {
    if (isPlatformBrowser(this._platformId)) {
    }
    this.loadXML();
  }

  loadXML(): void {
    console.log('Prueba')
    this.httpClient.get('assets/images/carruselXML/imagenescarrusel.xml', { responseType: 'text' })
      .subscribe((data: string) => {
        console.log('Prueba1')
        this.convertidorXmltoJson(data);
      });
  }

  convertidorXmltoJson(data): void{
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    this.xmltoJson = this.ngxXml2jsonService.xmlToJson(xml) as XmlCarruseles;
    this.dataXml = this.xmltoJson.carruseles.carrusel;
  }


}
