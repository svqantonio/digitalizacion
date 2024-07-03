import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { SeriesDocumentales } from '../interfaces/series-documentales';

@Injectable({
  providedIn: 'root'
})
export class SeriesDocumentalesService {

  private url_bbdd_seriesDocumentalesAdministracion: string = environment.url_proyecto + environment.url_bbdd_seriesDocumentalesAdministracion;

  constructor(private peticion: HttpClient) { }

  cargarSeriesDocumentales(){
    let peticion = JSON.stringify({
      action: "cargarSeriesDocumentales"
    })
    return this.peticion.post<SeriesDocumentales[]>(this.url_bbdd_seriesDocumentalesAdministracion, peticion);
  }

  cargarSerieDocumentalEspecifica(idSerieDocumental: number){
    let peticion =  JSON.stringify({
      action: "cargarSerieDocumentalEspecifica",
      idSerieDocumental: idSerieDocumental
    });
    return this.peticion.post<SeriesDocumentales>(this.url_bbdd_seriesDocumentalesAdministracion, peticion);
  }

  nuevaSerieDocumental(serieDocumental: SeriesDocumentales){
    let peticion = JSON.stringify({
      action: "nuevaSerieDocumental",
      serieDocumental: serieDocumental
    });
    return this.peticion.post<SeriesDocumentales[]>(this.url_bbdd_seriesDocumentalesAdministracion, peticion);
  }

  editarSerieDocumental(serieDocumental: SeriesDocumentales){
    let peticion = JSON.stringify({
      action: "editarSerieDocumental",
      serieDocumental: serieDocumental
    });
    return this.peticion.post<SeriesDocumentales[]>(this.url_bbdd_seriesDocumentalesAdministracion, peticion);
  }

  borrarSerieDocumental(idSerieDoc: number){
    let peticion = JSON.stringify({
      action: "borrarSerieDocumental",
      idSerieDoc: idSerieDoc
    });
    return this.peticion.post<SeriesDocumentales[]>(this.url_bbdd_seriesDocumentalesAdministracion, peticion);
  }
}