import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { numbers } from '../componentes/documentos-editar/documentos-editar.component';
import { Documentos } from '../interfaces/documentos';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  private url_bbdd_busquedas: string = environment.url_proyecto + environment.url_bbdd_busquedas;

  constructor(private peticion: HttpClient) { }

  buscarPorObservaciones(observaciones: any, pagina: number) {
    if (observaciones == undefined || observaciones == null) {
      var peticion = JSON.stringify({
        action: "buscarDocsPorObservaciones_offset_null",
        objeto: pagina
      });
      return this.peticion.post<any>(this.url_bbdd_busquedas, peticion);
    } else {
      var peticion = JSON.stringify({
        action: "buscarDocsPorObservaciones_offset",
        objeto: { observaciones, pagina }
      });
      console.log(peticion);
      return this.peticion.post<any>(this.url_bbdd_busquedas, peticion);
    }
  }

  buscarPorNumExpediente(numExpediente: number, offset: number) {
    console.log(numExpediente);
    if (numExpediente == undefined) {
      console.log("Hola");
      let peticion = JSON.stringify({
        action: "buscarPorNumExpediente_Null",
        objeto: offset
      }); 
      return this.peticion.post<any>(this.url_bbdd_busquedas, peticion);
    } else {
      let peticion = JSON.stringify({
        action: "buscarPorNumExpediente",
        numExpediente: { numExpediente, offset }
      });
      return this.peticion.post<any>(this.url_bbdd_busquedas, peticion);
    }
  }

  buscarDocsPorFecha_offset(fecha: Date, offset: number) {
    let peticion = JSON.stringify({
      action: "buscarDocsPorFecha_offset",
      objetosConsulta: { fecha, offset }
    });
    console.log(peticion);
    return this.peticion.post<Documentos[]>(this.url_bbdd_busquedas, peticion);
  }

  buscarDocsPorSerieDoc(serieDoc: number, offset: number) {
    let peticion = JSON.stringify({
      action: "buscarDocsPorSerieDoc",
      objetosConsulta: { serieDoc, offset }
    });
    return this.peticion.post<any>(this.url_bbdd_busquedas, peticion);
  }

  buscarPorUnidadDoc(unidadDoc: number, offset: number) {
    let peticion = JSON.stringify({
      action: "buscarPorUnidadDoc",
      objetosConsulta: { unidadDoc, offset }
    });
    return this.peticion.post<any>(this.url_bbdd_busquedas, peticion);
  }

  cuantosRegistrosHayPorBusqueda_observaciones(observaciones: any) {
    if (observaciones == undefined) {
      var peticion = JSON.stringify({
        action: "cuantosRegistrosHayPorBusqueda_observacionesNull",
      });
      return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
    } else {
      var peticion = JSON.stringify({
        action: "cuantosRegistrosHayPorBusqueda_observaciones",
        observaciones: observaciones
      });
      return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
    }
  }

  cuantosRegistrosHayPorBusqueda_fecha(fecha: Date) {
    let peticion = JSON.stringify({
      action: "cuantosRegistrosHayPorBusqueda_fecha",
      fecha: fecha
    });
    return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
  }

  cuantosRegistrosHayPorBusqueda_numExpediente(numExpediente: number) {
    if (numExpediente == null || numExpediente == undefined) {
      let peticion = JSON.stringify({
        action: "cuantosRegistrosHayPorBusqueda_numExpediente_Null"
      });
      return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
    } else {
      let peticion = JSON.stringify({
        action: "cuantosRegistrosHayPorBusqueda_numExpediente",
        num_expediente: numExpediente
      });
      return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
    }
  }

  cuantosRegistrosHayPorBusqueda_serieDocumental(serieDoc: number) {
    let peticion = JSON.stringify({
      action: "cuantosRegistrosHayPorBusqueda_serieDocumental",
      serieDoc: serieDoc
    }); 
    return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
  }

  cuantosRegistrosHayPorBusqueda_unidadDocumental(unidadDoc: number) {
    let peticion = JSON.stringify({
      action: "cuantosRegistrosHayPorBusqueda_unidadDocumental",
      unidadDoc: unidadDoc
    });
    return this.peticion.post<numbers>(this.url_bbdd_busquedas, peticion);
  }
}
