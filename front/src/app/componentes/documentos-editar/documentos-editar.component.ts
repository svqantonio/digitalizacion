import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { environment } from 'src/environments/environment.development';
import { SeriesDocumentales } from 'src/app/interfaces/series-documentales';
import { TipoContenedor } from 'src/app/interfaces/tipo-contenedor';
import { DocumentoEditar } from 'src/app/interfaces/documento-editar';
import Swal from 'sweetalert2';
import { DocumentosEditarService } from 'src/app/servicios/documentos-editar.service';
import { ContenedorSinVarchar } from 'src/app/interfaces/contenedor-sin-varchar';

export interface numbers {
  NUMERO: number
}

@Component({
  selector: 'app-documentos-editar',
  templateUrl: './documentos-editar.component.html',
  styleUrls: ['./documentos-editar.component.css']
})
export class DocumentosEditarComponent implements OnInit{

  public lista_seriesDocumentales: Array<SeriesDocumentales>; 
  public lista_tiposContenedores: Array<TipoContenedor>;
  public lista_numerosContenedores: Array<numbers>;

  private idRecibido: number;
  private num_expediente: number;

  public condicionUser: string;
  public documento: DocumentoEditar;

  constructor(private route: ActivatedRoute, private router: Router, private peticionDocService: DocumentosService, private peticionDocEditarService: DocumentosEditarService) {
    this.condicionUser = "";

    this.idRecibido = 0;
    this.num_expediente = 0;
    
    this.documento = <DocumentoEditar>{};

    this.lista_seriesDocumentales = [];
    this.lista_tiposContenedores = [];
    this.lista_numerosContenedores = [];
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
      
    this.condicionUser = environment.condicionUsuario;

    this.idRecibido = this.route.snapshot.params["id"];

    this.peticionDocService.cargarDocumento_editar(this.idRecibido).subscribe(datos=>{
      this.documento = datos;
      this.num_expediente = this.documento.NUM_EXPEDIENTE;

      this.cargarSeriesDocumentales();
      this.cargarTiposContenedores();
      this.cargarNumerosContenedores(this.documento.CONTENEDOR);      
    }, error=>console.log("Error al cargar datos del documento: ", error));
  } 

  editarUsuario(documentoEditar: any) {
    Swal.fire({
      title: '¿Estás seguro de que quieres editar el documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.num_expediente == documentoEditar.NUM_EXPEDIENTE) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Documento editado correctamente!',
            showConfirmButton: false,
            timer: 3000
          });
          this.editarDoc(documentoEditar);
        } else {
          this.peticionDocService.comprobarNum_Expediente(documentoEditar.NUM_EXPEDIENTE).subscribe(datos=>{
            if (datos.NUM_EXPEDIENTE == documentoEditar.NUM_EXPEDIENTE) {
              Swal.fire({
                title: '¡Error!',
                text: "¡Número de expediente ya introducido!",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Vale'
              });
            } else {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Documento editado correctamente!',
                showConfirmButton: false,
                timer: 3000
              });
              this.editarDoc(documentoEditar);
            }
          },error=>console.log("Error al comprobar número de expediente: ", error));
        }
      }
    })
  }

  editarDoc(documentoEditar: any){
    this.peticionDocService.devolverContenedorPorNumero(documentoEditar.TIPO_CONTENEDOR, documentoEditar.NUMERO).subscribe(datos=>{
      let idContenedor = datos.ID_CONTENEDOR;

      this.peticionDocEditarService.editarDocumento(documentoEditar.TITULO, documentoEditar.FECHA, documentoEditar.NUM_EXPEDIENTE, idContenedor, documentoEditar.SERIE_DOCUMENTAL, this.documento.ID_DOCUMENTO).subscribe(datos=>{
        this.router.navigate(["/list"]);
      },error=>console.log("Error al editar documento: ", error));
    },error=>console.log("Error al cargar id del contenedor: ", error));
  }

  cargarSeriesDocumentales() {
    this.peticionDocService.cargarSeriesDocumentales().subscribe(datos=>{
      this.lista_seriesDocumentales = datos;
    },error=>console.log("Error al cargar series documentales: ", error));
  }

  cargarTiposContenedores() {
    this.peticionDocService.selectTipoContenedores().subscribe(datos=>{
      this.lista_tiposContenedores = datos;
    },error=>console.log("Error al cargar los tipos de contenedores: ", error));
  }

  cargarNumerosContenedores(tipoContenedor: number) {
    this.peticionDocService.selectNumeroContenedor(tipoContenedor).subscribe(datos=>{
      this.lista_numerosContenedores = datos;
    },error=>console.log("Error al cargar el número de contenedores: ", error));
  }

  cambioTipoContenedor(tipoContenedor: number) {
    this.peticionDocService.selectNumeroContenedor(tipoContenedor).subscribe(datos=>{
      this.lista_numerosContenedores = datos;
    },error=>console.log("Error al cargar números de contenedor: ", error));
  }

  volver() {
    Swal.fire({
      position: 'center',
      icon: 'question',
      title: '¿Estás seguro de que quieres volver a la lista?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Volver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed)
        this.router.navigate(["/list"]);
    });
  }

}
