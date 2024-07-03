import { Component, OnInit } from '@angular/core';
import { Documentos } from 'src/app/interfaces/documentos';
import { SeriesDocumentales } from 'src/app/interfaces/series-documentales';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { TipoContenedor } from 'src/app/interfaces/tipo-contenedor';
import { ContenedorTipoNumero } from 'src/app/interfaces/contenedor-tipo-numero';
import { numbers } from '../documentos-editar/documentos-editar.component';

@Component({
  selector: 'app-pruebas',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit{

  public lista_tipoContenedores: Array<TipoContenedor>;
  public lista_numerosContenedores: Array<numbers>;
  public lista_seriesDocumentales: Array<SeriesDocumentales>;
  public documento: Documentos;

  public contenedor: ContenedorTipoNumero;
  public serieDocumental: number;
  
  public tipoContenedor_seleccionado: boolean = false;
  public cargado: boolean = false;

  public numeroContenedor: number;
  public contenedorDevuelto: numbers;
  private ultimoDoc_usersJson: any;

  constructor(private peticion: DocumentosService, private http: HttpClient, private router: Router) {
    this.lista_tipoContenedores = [];
    this.lista_seriesDocumentales = [];
    this.lista_numerosContenedores = [];
    
    this.contenedor = <ContenedorTipoNumero>{};
    this.serieDocumental = <number>{};  
    this.documento = <Documentos>{}
    
    this.numeroContenedor = 0;
    this.contenedorDevuelto = <numbers>{};
  }

  ngOnInit(): void {
    const headers = new HttpHeaders ({
      'Accept': '*',
      'Access-Control-Allow-Origin': '*'
    });
    
    this.peticion.selectTipoContenedores().subscribe(datos=>{
      this.lista_tipoContenedores = datos;
    },error=>console.log("Error al cargar el select de los tipos de contenedores: ", error));
    this.peticion.cargarSeriesDocumentales().subscribe(datos=>{
      this.lista_seriesDocumentales = datos;
    },error=>console.log("Error al cargar las series documentales: ", error));

    if (this.contenedor.tipo == undefined) 
      this.contenedor.tipo = 0;
    
    if (this.serieDocumental == undefined) 
      this.serieDocumental = 0;
  
    if (this.numeroContenedor == undefined) 
      this.numeroContenedor = 0;

    if (sessionStorage.getItem("tipoContenedor") != undefined && sessionStorage.getItem("tipoContenedor") != null) 
      this.contenedor.tipo = sessionStorage.getItem("tipoContenedor") as unknown as number;
    else 
      this.contenedor.tipo = 0;

    if (sessionStorage.getItem("serieDocumental") != undefined && sessionStorage.getItem("serieDocumental") != null) 
      this.serieDocumental = sessionStorage.getItem("serieDocumental") as unknown as number;
    else 
      this.serieDocumental = 0;

    if (sessionStorage.getItem("numeroContenedor") != undefined && sessionStorage.getItem("numeroContenedor") != null) {
      this.tipoContenedor_seleccionado = true;
      this.peticion.cargarNumeroContenedoresSessionStorage(this.contenedor.tipo).subscribe(datos=>{
        this.lista_numerosContenedores = datos;
        this.numeroContenedor = sessionStorage.getItem("numeroContenedor") as unknown as number;
      },error=>console.log("Error al cargar la lista: ", error));
    } else 
      this.numeroContenedor = 0;

    if (sessionStorage.getItem("metidoInsert") == "2" ) {
      this.http.get(environment.url_proyecto + environment.url_usersJson, { headers }).subscribe(data => {
        this.ultimoDoc_usersJson = data;
        sessionStorage.setItem("ruta", environment.url_proyecto + environment.url_archivosApi + this.ultimoDoc_usersJson[this.ultimoDoc_usersJson.length - 1].file);
            
        this.peticion.actualizarConRuta(sessionStorage.getItem("ruta"), sessionStorage.getItem("idDoc")).subscribe(datos=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Documento añadido correctamente!',
            showConfirmButton: false,
            timer: 2000
          });
        },error=>console.log("Error al actualizar: ", error));
      }, error=>console.log("Error en la peticion get: ", error));
    } else 
      this.removerVariablesSesion();

    sessionStorage.setItem("metidoInsert", "1");
  }

  removerVariablesSesion() {
    sessionStorage.removeItem("ruta");
    sessionStorage.removeItem("idDoc");
    sessionStorage.removeItem("serieDocumental");
    sessionStorage.removeItem("numeroContenedor");
    sessionStorage.removeItem("tipoContenedor");
  }

  volver() {
    sessionStorage.setItem("metidoInsert", "1");
    this.removerVariablesSesion();
    this.router.navigate(["main"]);
  }

  cambioTipoContenedor(tipoContenedor: number) {
    this.tipoContenedor_seleccionado = true;
    this.peticion.selectNumeroContenedor(tipoContenedor).subscribe(datos=>{
      this.lista_numerosContenedores = datos;
    }, error=>console.log("Error al listar segundo select: ", error));
  }

  onSubmitPrueba(documento: any){
    sessionStorage.setItem("serieDocumental", documento.SERIE_DOCUMENTAL);
    sessionStorage.setItem("tipoContenedor", documento.TIPO_CONTENEDOR);
    sessionStorage.setItem("numeroContenedor", documento.NUMERO_CONTENEDOR);
    sessionStorage.setItem("metidoInsert", "2");

    if (documento.SERIE_DOCUMENTAL == 0) {
      Swal.fire({
        title: '¡Error!',
        text: "¡Tienes que seleccionar una serie documental!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale'
      }).then((result) => {
        if (result.isConfirmed) 
          sessionStorage.setItem("metidoInsert", "1");
      });
    }
    else if (documento.TIPO_CONTENEDOR == 0) {
      Swal.fire({
        title: '¡Error!',
        text: "¡Tienes que seleccionar un tipo de contenedor!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale'
      }).then((result) => {
        if (result.isConfirmed) 
          sessionStorage.setItem("metidoInsert", "1");
        
      });
    }
    else if (documento.TIPO_CONTENEDOR == 0) {
      Swal.fire({
        title: '¡Error!',
        text: "¡Tienes que seleccionar un tipo de contenedor!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ok'
      }).then((result) => {
        if (result.isConfirmed) 
          sessionStorage.setItem("metidoInsert", "1");
        
      });
    }
    else if (documento.NUMERO_CONTENEDOR == 0 || documento.NUMERO_CONTENEDOR == undefined) {
      Swal.fire({
        title: '¡Error!',
        text: "¡Tienes que seleccionar un número de contenedor!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale'
      }).then((result) => {
        if (result.isConfirmed) 
          sessionStorage.setItem("metidoInsert", "1");
        
      });
    }
    else if (documento.FECHA == undefined || documento.FECHA == '') {
      Swal.fire({
        title: '¡Error!',
        text: "¡Tienes que rellenar el campo fecha!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale'
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.setItem("metidoInsert", "1");
        }
      });
    } else if (moment(documento.FECHA).year() > 2023){
      Swal.fire({
        title: '¡Error!',
        text: "¡Tienes que poner una fecha correcta!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale'
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.setItem("metidoInsert", "1");
        }
      });
    } else {
      if (documento.TITULO == undefined ) 
        documento.TITULO = null;

      this.peticion.devolverContenedorPorNumero(documento.TIPO_CONTENEDOR, documento.NUMERO_CONTENEDOR).subscribe(datos=>{
        this.contenedorDevuelto = datos;
        if (documento.NUM_EXPEDIENTE == undefined || documento.NUM_EXPEDIENTE == '') {
          Swal.fire({
            title: '¿Estás seguro de que quieres añadirlo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Añadir',
          }).then((result) => {
            if (result.isConfirmed) {
              this.peticion.insertDocumentoSinNumExpediente(documento.TITULO, documento.FECHA, documento.SERIE_DOCUMENTAL, this.contenedorDevuelto.NUMERO).subscribe(datos=>{
                sessionStorage.setItem("idDoc", datos.ID_DOCUMENTO as unknown as string);
                window.location.href = environment.url_proyecto + environment.url_api;
              },error=>console.log("Error al hacer el insert: ",error)); 
            }
          });
        } else {
          this.peticion.comprobarNum_Expediente(documento.NUM_EXPEDIENTE).subscribe(datos=>{
            if (datos.NUM_EXPEDIENTE == documento.NUM_EXPEDIENTE) {
              Swal.fire({
                title: '¡Error!',
                text: "¡Número de expediente ya introducido!",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Vale'
              }).then((result) => {
                if (result.isConfirmed) 
                  sessionStorage.setItem("metidoInsert", "1");
                
              });
            } else {
              Swal.fire({
                title: '¿Estás seguro de que quieres añadirlo?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Añadir'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.peticion.insertDocumentosConNumExpediente(documento.TITULO, documento.NUM_EXPEDIENTE, documento.FECHA, documento.SERIE_DOCUMENTAL, this.contenedorDevuelto.NUMERO).subscribe(datos=>{
                    sessionStorage.setItem("idDoc", datos.ID_DOCUMENTO as unknown as string);
                    window.location.href = environment.url_proyecto + environment.url_api;
                  },error=>console.log("Error al insertar documento con número de expediente: ",error));
                }
              },error=>console.log("Error al comprobar el número de expediente: ",error));
            }
          });
        }
      },error=>console.log("Error al devolver un contenedor: ",error));
    }
  }
}
