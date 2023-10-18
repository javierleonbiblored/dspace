export interface XmlCarruseles {
  carruseles: Carruseles;
}

export interface Carruseles {
  carrusel: Carrusel[];
}

export interface Carrusel {
  titulo: string;
  Descripcion: string;
  urlImagen: string;
  urlEnlace: string;
  txtBoton: string;
}
