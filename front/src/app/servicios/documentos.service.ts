import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

// INTERFACES
import { SeriesDocumentales } from '../interfaces/series-documentales';
import { Contenedores } from '../interfaces/contenedores';
import { Documentos } from '../interfaces/documentos';
import { TipoContenedor } from '../interfaces/tipo-contenedor';
import { DocumentoEditar } from '../interfaces/documento-editar';
import { ContenedorSinVarchar } from '../interfaces/contenedor-sin-varchar';

export interface prueba{
  REGISTROS: number
}

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  private url_bbdd_subidaDeArchivos: string = environment.url_proyecto + environment.url_bbdd_subidaDeArchivos;
  private url_bbdd_unidadesDocumentales: string = environment.url_proyecto + environment.url_bbdd_unidadesDocumentales;
  private url_bbdd_seriesDocumentales: string = environment.url_proyecto + environment.url_bbdd_seriesDocumentalesAdministracion;

  constructor(private peticion: HttpClient) { }

  //SELECT 

  cargarDocumento_editar(idDoc: number) {
    let peticion = JSON.stringify({
      action: "cargarDocumento_editar",
      idDoc: idDoc
    });
    return this.peticion.post<DocumentoEditar>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  cargarSeriesDocumentales(){
    let peticion = JSON.stringify({
      action: "cargarSeriesDocumentales"
    })
    return this.peticion.post<SeriesDocumentales[]>(this.url_bbdd_seriesDocumentales, peticion);
  }

  cargarListaCompleta_Contenedores() {
    let peticion = JSON.stringify({
      action: "cargarListaCompleta_Contenedores"
    });
    return this.peticion.post<ContenedorSinVarchar[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarUltimosCincoContenedores(){
    let peticion = JSON.stringify({
      action: "cargarUltimosCincoContenedores"
    });
    return this.peticion.post<ContenedorSinVarchar[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  cargarNumeroContenedoresSessionStorage(tipoContenedor: any) {
    let peticion = JSON.stringify({
      action: "cargarNumeroContenedoresSessionStorage",
      tipoContenedor: tipoContenedor
    }); 
    return this.peticion.post<Contenedores[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  selectTipoContenedores() {
    let peticion = JSON.stringify({
      action: "selectTipoContenedores"
    });
    return this.peticion.post<TipoContenedor[]>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  selectNumeroContenedor(id: number){
    let peticion = JSON.stringify({
      action: "selectNumeroContenedor",
      id: id
    });
    return this.peticion.post<any[]>(this.url_bbdd_unidadesDocumentales, peticion);
  }

  devolverContenedorPorNumero(TIPO_CONTENEDOR: number, NUMERO: number){
    let peticion = JSON.stringify({
      action: "devolverContenedorPorNumero",
      objeto: { TIPO_CONTENEDOR, NUMERO }
    }); 
    return this.peticion.post<any>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  comprobarNum_Expediente(numExpediente: number){
    let peticion = JSON.stringify({
      action: "comprobarNum_Expediente",
      numExpediente: numExpediente
    });
    return this.peticion.post<any>(this.url_bbdd_subidaDeArchivos, peticion);
  }
  
  ultRegistro() {
    let peticion = JSON.stringify({
      action: "ultRegistro"
    });
    return this.peticion.post<any>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  devolverNumRegistros() {
    let peticion = JSON.stringify({
      action: "devolverNumRegistros"
    });
    return this.peticion.post<prueba>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  cargarLista_numeracion(num: number){
    let peticion = JSON.stringify({
      action: "cargarLista_numeracion",
      num: num
    });
    return this.peticion.post<any[]>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  //UPDATE
  updateDoc(TITULO: string, FECHA: Date, NUM_EXPEDIENTE: number, RUTA: string, SERIE_DOCUMENTAL: number, CONTENEDOR: number, ID_DOCUMENTO: number) {
    let peticion = JSON.stringify({
      action: "updateDoc",
      doc: { TITULO, FECHA, NUM_EXPEDIENTE, RUTA, SERIE_DOCUMENTAL, CONTENEDOR, ID_DOCUMENTO }
    });
    return this.peticion.post(this.url_bbdd_subidaDeArchivos, peticion);
  }

  actualizarConRuta(ruta: any, id: any){
    let peticion = JSON.stringify({
      action: "actualizarConRuta",
      objeto: { ruta, id }
    });
    return this.peticion.post(this.url_bbdd_subidaDeArchivos, peticion);
  }

  //INSERT
  insertDocumentoSinNumExpediente(TITULO: string, FECHA: Date, SERIE_DOCUMENTAL: number, CONTENEDOR: number) {
    let peticion = JSON.stringify({
      action: "insertDocumentoSinNumExpediente",
      documento: { TITULO, FECHA, SERIE_DOCUMENTAL, CONTENEDOR }
    });
    return this.peticion.post<Documentos>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  insertDocumentosConNumExpediente(TITULO: string, NUM_EXPEDIENTE: number, FECHA: Date, SERIE_DOCUMENTAL: number, CONTENEDOR: number) {
    let peticion = JSON.stringify({
      action: "insertDocumentosConNumExpediente",
      documento: { TITULO, NUM_EXPEDIENTE, FECHA, SERIE_DOCUMENTAL, CONTENEDOR }
    }); 
    return this.peticion.post<Documentos>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  //DELETE
  borrarDocumento(idDocumento: number) {
    let peticion = JSON.stringify({
      action: "borrarDocumento",
      idDocumento: idDocumento
    });
    return this.peticion.post<Documentos[]>(this.url_bbdd_subidaDeArchivos, peticion);
  }

  borrarDocumentoList(idDocumento: number) {
    let peticion = JSON.stringify({
      action: "borrarDocumento",
      idDocumento: idDocumento
    });
    return this.peticion.post(this.url_bbdd_subidaDeArchivos, peticion);
  }

}
