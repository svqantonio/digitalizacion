import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentosEditarService {

  private url_bbdd_documentosEditar: string = environment.url_proyecto + environment.url_bbdd_documentosEditar;

  constructor(private peticion: HttpClient) { }

  editarDocumento(TITULO: String, FECHA: Date, NUM_EXPEDIENTE: number, CONTENEDOR: number, SERIE_DOCUMENTAL: number, ID_DOCUMENTO: number) {
    let peticion = JSON.stringify({
      action: "editarDocumento",
      documento: { TITULO, FECHA, NUM_EXPEDIENTE, SERIE_DOCUMENTAL, CONTENEDOR, ID_DOCUMENTO}
    });
    return this.peticion.post(this.url_bbdd_documentosEditar, peticion);
  }

}
