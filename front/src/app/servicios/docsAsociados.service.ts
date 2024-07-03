import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { SubirDocumento } from '../interfaces/subir-documento';

@Injectable({
  providedIn: 'root'
})
export class DocsAsociadosService {

  private url_bbdd_docsAsociados: string = environment.url_proyecto + environment.url_bbdd_DocsAsociados;

  constructor(private peticion: HttpClient) { }

  devolverDocumentos_contenedorSeleccionado(idContenedor: number) {
    let peticion = JSON.stringify({
      action: "devolverDocumentos_contenedorSeleccionado",
      idContenedor: idContenedor
    });
    return this.peticion.post<SubirDocumento[]>(this.url_bbdd_docsAsociados, peticion);
  }

  borrarDocumento(idDocumento: number) {
    let peticion = JSON.stringify({
      action: "borrarDocumento",
      idDocumento: idDocumento
    });
    return this.peticion.post(this.url_bbdd_docsAsociados, peticion);
  }
}