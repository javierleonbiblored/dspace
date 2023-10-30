import {Component, Inject, PLATFORM_ID,} from '@angular/core';
import {NgxXml2jsonService} from 'ngx-xml2json';
import {Carrusel, Carruseles, XmlCarruseles} from "./tb_xmltoJson.type";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'ds-home-news',
  styleUrls: ['./home-news.component.scss'],
  templateUrl: './home-news.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent {


  xmltoJson: XmlCarruseles;
  dataXml: Carrusel[]
  xml = `<?xml version="1.0" encoding="UTF-8" ?>
<carruseles>
    <carrusel>
        <titulo>Titulo 1</titulo>
        <Descripcion>La colección "Patrimonio y Memoria" reúne contenidos que dan cuenta del papel de la biblioteca pública como escenario para la participación de la ciudadanía en el ejercicio de recopilar, sistematizar, divulgar y apropiar los saberes locales que reconocemos como parte de la memoria y patrimonio de nuestras comunidades.</Descripcion>
        <urlImagen>https://www.biblored.gov.co/sites/default/files/2023-10/HOME722_banner%20home%20copia.jpg</urlImagen>
        <urlEnlace>https://biblored.gov.co/noticias/festival-libros-ninos-jovenes-en-bibliotecas</urlEnlace>
        <txtBoton>Ver más</txtBoton>
    </carrusel>
    <carrusel>
        <titulo>titulo 2</titulo>
        <Descripcion>La colección "Patrimonio y Memoria" reúne contenidos que dan cuenta del papel de la biblioteca pública como escenario para la participación de la ciudadanía en el ejercicio de recopilar, sistematizar, divulgar y apropiar los saberes locales que reconocemos como parte de la memoria y patrimonio de nuestras comunidades.</Descripcion>
        <urlImagen>https://www.biblored.gov.co/sites/default/files/2023-10/HOME721_banner%20home%20copia.jpg</urlImagen>
        <urlEnlace>https://biblored.gov.co/noticias/resenas-colecciones-BDB-octubre</urlEnlace>
        <txtBoton>txtBoton 2</txtBoton>
    </carrusel>
</carruseles>`;


  constructor(
    private ngxXml2jsonService: NgxXml2jsonService,
    @Inject(PLATFORM_ID) protected _platformId: Object) {
    if (isPlatformBrowser(this._platformId)) {
      const parser = new DOMParser();
      const xml = parser.parseFromString(this.xml, 'text/xml');
      this.xmltoJson = this.ngxXml2jsonService.xmlToJson(xml) as XmlCarruseles;
      this.dataXml = this.xmltoJson.carruseles.carrusel;
    }
  }
}
