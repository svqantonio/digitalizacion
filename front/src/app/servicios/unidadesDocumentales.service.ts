import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoContenedor } from '../interfaces/tipo-contenedor';
import { environment } from 'src/environments/environment.development';
import { Contenedores } from '../interfaces/contenedores';
import { SubirDocumento } from '../interfaces/subir-documento';

@Injectable({
  providedIn: 'root'
})
export class UnidadesDocumentalesService {

  private url_bbdd_unidadesDocumentales: string = environment.url_proyecto + environment.url_bbdd_unidadesDocumentales;

  constructor(private peticion: HttpClient) { }

  buscarContenedorPorLegajo(tipo_contenedor: number, numero_contenedor: number) {
    let peticion = JSON.stringify({
      action: "busquedaContenedorAdministracion",
      busqueda: { tipo_contenedor, numero_contenedor }
    }); 
    return this.peticion.post<any[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  buscarContenedorPorYear(fecha: number, fecha2: number) {
    let peticion = JSON.stringify({
      action: "busquedaContenedorPorYear",
      fecha: { fecha, fecha2 } 
    }); 
    return this.peticion.post<any[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  buscarContenedorPorLocalizacion(localizacion: string) {
    let peticion = JSON.stringify({
      action: "buscarContenedorPorLocalizacion",
      localizacion: localizacion
    });
    return this.peticion.post<any>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  informacionCompletaContenedores(tipoContenedor: number) {
    let peticion = JSON.stringify({
      action: "cargarNumeroContenedoresSessionStorage",
      tipoContenedor: tipoContenedor
    }); 
    return this.peticion.post<Contenedores[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarTipoContenedores(){
    let peticion = JSON.stringify({
      action: "cargarTipoContenedores"
    });
    return this.peticion.post<TipoContenedor[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarListaCompleta_Contenedores() {
    let peticion = JSON.stringify({
      action: "cargarListaCompleta_Contenedores"
    });
    return this.peticion.post<any[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarUltimosCincoContenedores() {
    let peticion = JSON.stringify({
      action: "cargarUltimosCincoContenedores"
    });
    return this.peticion.post<any[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  nuevoTipoContenedor(contenedor: Contenedores){
    let peticion = JSON.stringify({
      action: "nuevosTiposContenedores",
      contenedor: contenedor
    });
    return this.peticion.post<Contenedores[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  editarContenedor(contenedorEditar: Contenedores){
    let peticion = JSON.stringify({
      action: "editarContenedor",
      contenedorEditar: contenedorEditar
    });
    return this.peticion.post<Contenedores[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarContenedorEspecifico(idContenedor: number) {
    let peticion = JSON.stringify({
      action: "cargarContenedorEspecifico",
      idContenedor: idContenedor
    }); 
    return this.peticion.post<Contenedores>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarTodosLosDocs_contenedor(idContenedor: number){
    let peticion = JSON.stringify({
      action: "cargarTodosLosDocs_contenedor",
      idContenedor: idContenedor
    }); 
    return this.peticion.post<SubirDocumento[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  borrarDocumento(idDocumento: number){
    let peticion = JSON.stringify({
      action: "borrarDocumento",
      idDocumento: idDocumento
    });
    return this.peticion.post(this.url_bbdd_unidadesDocumentales, peticion);
  }

  borrarContenedor(idContenedor: number){
    let peticion = JSON.stringify({
      action: "borrarContenedor",
      idContenedor: idContenedor
    });
    return this.peticion.post<Contenedores[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  comprobarNumero(numero: number) {
    let peticion = JSON.stringify({
      action: "comprobarNumero",
      numero: numero
    });
    return this.peticion.post<number>(this.url_bbdd_unidadesDocumentales, peticion);
  }

}
