import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgxXml2jsonService} from "ngx-xml2json";
import {HttpClient} from "@angular/common/http";
import {Coleccion, XmlColecciones} from "./tb_xmltoJson.type";

@Component({
  selector: 'ds-colecciones-home',
  templateUrl: './colecciones-home.component.html',
  styleUrls: ['./colecciones-home.component.scss']
})
export class ColeccionesHomeComponent implements OnInit {
  xmltoJsonCarrusel: XmlColecciones;
  dataXmlCarrusel: Coleccion[] = [];


  constructor(
    private router: Router,
    private ngxXml2jsonService: NgxXml2jsonService,
    private httpClient: HttpClient
  ) {
    this.loadXML();
  }

  ngOnInit(): void {
  }

  viewPage() {
    this.router.navigate(['/community-list'])
  }

  loadXML(): void {
    this.httpClient.get('assets/colecciones/coleccionesprincipales.xml', {responseType: 'text'})
      .subscribe((data: string) => {
        this.colecciones(data);
      });
  }

  colecciones(data): void {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, 'text/xml');
    this.xmltoJsonCarrusel = this.ngxXml2jsonService.xmlToJson(xml) as XmlColecciones;
    this.dataXmlCarrusel = this.xmltoJsonCarrusel.colecciones.coleccion;
  }

  viewPageDestino(url): void {
    window.open(url)
  }

}
