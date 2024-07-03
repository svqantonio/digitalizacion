import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoContenedor } from 'src/app/interfaces/tipo-contenedor';
import { UnidadesDocumentalesService } from 'src/app/servicios/unidadesDocumentales.service';
import { Contenedores } from 'src/app/interfaces/contenedores';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment.development';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { SubirDocumento } from 'src/app/interfaces/subir-documento';

export interface busquedaContenedores {
  select: number,
  tipo_contenedor: number,
  numero_contenedor: number,
  year: number,
  localizacion: string
}

export interface Documentos {
  ID_DOCUMENTO: number,
  TITULO: string,
  FECHA: Date, 
  NUMERO_EXPEDIENTE: string,
  SERIE_DOCUMENTAL: number,
  CONTENEDOR: number
}

@Component({
  selector: 'app-unidadesDocumentales',
  templateUrl: './unidadesDocumentales.component.html',
  styleUrls: ['./unidadesDocumentales.component.css']
})
export class UnidadesDocumentalesComponent implements OnInit{

  @ViewChild('nuevoContenedorForm') myTemplateForm!: NgForm;

  public lista_tiposContenedores: Array<TipoContenedor>;
  public lista_contenedores: Array<Contenedores>;
  public lista_contenedores_busqueda: Array<Contenedores>;
  public lista_todosLosDocumentos: Array<SubirDocumento>;

  private idContenedor: number;
  public contenedor: Contenedores;
  private contenedor_vacio: Contenedores;
  public condicionUser: string = "";

  public busqueda: busquedaContenedores;
  private busquedaVacia: busquedaContenedores;

  public inputTipoContenedor: boolean = false;
  public inputNumeroContenedor: boolean = false;
  public inputYear: boolean = false;
  public inputLocalizacion: boolean = false;
  public buttonCerrarBusqueda: boolean = false;
  public tabla_todosLosDocs: boolean = false;

  public formulario: boolean = false;
  public nuevo: boolean = true;
  public editar: boolean = false;
  public funcion: string = "Añadir";

  constructor(private peticion: UnidadesDocumentalesService, private peticionDocService: DocumentosService) {
    this.lista_tiposContenedores = [];
    this.lista_contenedores = [];
    this.lista_contenedores_busqueda = [];
    this.lista_todosLosDocumentos = [];

    this.busqueda = <busquedaContenedores>{
      select: 0,
      tipo_contenedor: 0,
      numero_contenedor: 0,
      year: 1800,
      localizacion: ""
    };

    this.busquedaVacia = <busquedaContenedores> {
      select: 0,
      tipo_contenedor: 0,
      numero_contenedor: 0,
      year: 1800,
      localizacion: ""
    }

    this.contenedor = <Contenedores>{
      TIPO_CONTENEDOR: 0,
    };

    this.contenedor_vacio = <Contenedores>{
      TIPO_CONTENEDOR: 0,
    };
    
    this.idContenedor = 0;
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
      
    this.condicionUser = environment.condicionUsuario;

    this.cargarUltimosCincoContenedores();

    this.peticion.cargarTipoContenedores().subscribe(datos=>{
      this.lista_tiposContenedores = datos;
    },error=>console.log("Error al cargar los tipos de contenedores: ", error));
  }

  docsAsociados(idContenedor: number) {
    this.idContenedor = idContenedor;
    this.formulario = false;

    this.peticion.cargarContenedorEspecifico(idContenedor).subscribe(datos=>{
      this.contenedor = datos;
    },error=>console.log("Error al cargar información del contenedor: ",error));

    this.peticion.cargarTodosLosDocs_contenedor(idContenedor).subscribe(datos=>{
      this.lista_todosLosDocumentos = datos;

      if (this.lista_todosLosDocumentos.length == 0) {
        this.tabla_todosLosDocs = false;
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: '¡No hay documentos!',
          showConfirmButton: false,
          timer: 2000
        });
      } else 
        this.tabla_todosLosDocs = true;
    },error=>console.log("Error al cargar todos los docs de un contenedor: ",error));
  }

  borrarDoc(documento: SubirDocumento){
    Swal.fire({
      title: '¿Estás seguro de que quieres borrarlo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.peticion.borrarDocumento(documento.ID_DOCUMENTO).subscribe(datos=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Borrado correctamente',
            showConfirmButton: false,
            timer: 2500,
          });
        });
        this.peticion.cargarTodosLosDocs_contenedor(this.idContenedor).subscribe(data=>{
          this.lista_todosLosDocumentos = data;
          if (this.lista_todosLosDocumentos.length == 0) {
            this.tabla_todosLosDocs = !this.tabla_todosLosDocs;
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: '¡No hay más documentos!',
              showConfirmButton: false,
              timer: 2500
            })
          }
        },error=>console.log("Error al cargar de nuevo: ",error)); 
      }
    });
  }

  cargarUltimosCincoContenedores() {
    this.peticion.cargarUltimosCincoContenedores().subscribe(datos=>{
      this.lista_contenedores = datos;
    },error=>console.log("Error al cargar los contenedores: ", error));
  }

  filtroBusquedaSeleccionado(filtro: number) {
    if (filtro == 1) {
      this.inputTipoContenedor = true;
      this.inputYear = false;
      this.inputLocalizacion = false;
    } else if (filtro == 2) {
      this.inputYear = true;
      this.inputTipoContenedor = false;
      this.inputNumeroContenedor = false;
      this.inputLocalizacion = false;
    } else if (filtro == 3) {
      this.inputLocalizacion = true;
      this.inputTipoContenedor = false;
      this.inputNumeroContenedor = false;
      this.inputYear = false;
    }
  }

  tipoContenedorSeleccionado(tipoContenedor: number) {
    this.peticion.informacionCompletaContenedores(tipoContenedor).subscribe(datos=>{
      this.lista_contenedores_busqueda = datos; 
      this.inputNumeroContenedor = true;
    },error=>console.log("Error: ", error));
  }

  buscar() {
    if (this.inputTipoContenedor == true && this.inputNumeroContenedor == true)
      this.peticion.buscarContenedorPorLegajo(this.busqueda.tipo_contenedor, this.busqueda.numero_contenedor).subscribe(datos=>{
        this.lista_contenedores = datos;
        this.buttonCerrarBusqueda = true;
      },error=>console.log("Error al buscar por legajo: ", error));
    else if (this.inputYear == true)
      this.peticion.buscarContenedorPorYear(this.busqueda.year, this.busqueda.year).subscribe(datos=>{
        if (datos.length == 0)
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: '¡No existe contenedor con este año!',
            showConfirmButton: false,
            timer: 2000
          });
        else {
          this.lista_contenedores = datos;
          this.buttonCerrarBusqueda = true;
        }
      },error=>console.log("Error al buscar por año: ", error));
    else
      if (this.busqueda.localizacion == undefined || this.busqueda.localizacion == "")
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: '¡Tienes que escribir una localización!',
          showConfirmButton: false,
          timer: 2000
        });
      else 
        this.peticion.buscarContenedorPorLocalizacion(this.busqueda.localizacion).subscribe(datos=>{
          this.lista_contenedores = datos;
          this.buttonCerrarBusqueda = true;
        },error=>console.log("Error al buscar por localización: ", error));
  }

  submitNuevoContenedor(contenedor: Contenedores) {
    console.log("Lo que vas a subir: ", this.contenedor);
    console.log("Variables: nuevo: " + this.nuevo + ". Editar: " + this.editar);
    if (this.nuevo == true) {
      if (contenedor.TIPO_CONTENEDOR == 1)
        var tipo = "Legajo"
      else 
        var tipo = "Libro"

      Swal.fire({
        title: '¿Estás seguro de querer añadir este ' + tipo + '?',
        showCancelButton: true,
        confirmButtonText: 'Añadir',
      }).then((result) => {
        if (result.isConfirmed)
          this.peticion.comprobarNumero(this.contenedor.NUMERO).subscribe(datos=>{
            if (contenedor.FECHA_INICIO >= contenedor.FECHA_FIN)
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡La fecha de inicio tiene que ser menor que la fecha de fin!',
                showConfirmButton: true,
                confirmButtonText: 'Vale'
              });
            else if (contenedor.FECHA_INICIO >= 1700)
              if (contenedor.FECHA_FIN <= 2023)
                if (contenedor.FECHA_INICIO < contenedor.FECHA_FIN)
                  this.peticion.nuevoTipoContenedor(contenedor).subscribe(datos=>{
                    this.lista_contenedores = datos;
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Unidad documental añadida correctamente!',
                      showConfirmButton: false,
                      timer: 2500
                    });
                  }, error=>console.log("Error al añadir nuevo contenedor: ", error));
                else
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡La fecha de fin tiene que ser mayor que la de inicio!',
                    showConfirmButton: true,
                    confirmButtonText: 'Vale'
                  });
              else
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: '¡La fecha de fin tiene que tener un año por debajo de 2023!',
                  showConfirmButton: true,
                  confirmButtonText: 'Vale'
                });
            else 
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡La fecha de inicio tiene que tener un año por encima de 1700!',
                showConfirmButton: true,
                timer: 2000
              });
          });
      },error=>console.log("Error al comprobar número: ",error));
    } else 
      Swal.fire({
        title: '¿Estás seguro de que quieres editar el contenedor?',
        icon: 'question',
        position: 'center',
        showCancelButton: true,
        confirmButtonText: 'Vale',
        confirmButtonColor: '#3085d6',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#FF2D00'
      }).then((result) => {
        if (result.isConfirmed) 
          this.peticion.comprobarNumero(this.contenedor.NUMERO).subscribe(datos=>{
            var numero = datos;
            if (numero == this.contenedor.NUMERO)
              Swal.fire({
                title: '¡Número ya existente!',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Vale'
              });
            else if (this.contenedor.FECHA_INICIO >= this.contenedor.FECHA_FIN) 
              Swal.fire({
                title: '¡El <u>AÑO de INICIO</u> tiene que ser <u>MENOR</u> que el <u>AÑO de FIN</u>!',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Vale'
              });
            else 
              this.peticion.editarContenedor(this.contenedor).subscribe(datos=>{
                this.lista_contenedores = datos;
                this.formulario = false;
                this.cerrarInputs();
              },error=>console.log("Error al editar contenedor: ",error));
          },error=>console.log("Error al comprobar nuevo de expediente: ",error));
      });
  }

  btnNuevoEditar_segunValor(id: number) {
    if (id == 0) {
      this.nuevo = true;
      this.editar = false;
      this.funcion = "Añadir";
      this.contenedor = this.contenedor_vacio;
    } else { 
      this.editar = true;
      this.nuevo = false;
      this.funcion = "Editar";
      this.peticion.cargarContenedorEspecifico(id).subscribe(datos=>{
        this.contenedor = datos;  
      },error=>console.log("Error al listar contenedor especifico: ",error));
    }
    if (this.formulario == false)
      this.formulario = !this.formulario;
  }

  borrarContenedor(contenedor: Contenedores) {
    Swal.fire({
      title: '¿Estás seguro de que quieres borrar el ' + contenedor.TIPO_CONTENEDOR + ' ' + contenedor.NUMERO + '?',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      confirmButtonColor: '#FF2D00',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#0037FF'
    }).then((result) => {
      if (result.isConfirmed)
        this.peticion.borrarContenedor(contenedor.ID_CONTENEDOR).subscribe(datos=>{
          this.lista_contenedores = datos;
        },error=>console.log("Error al borrar el contenedor: ",error));   
    });
  }

  cerrarInputs() {
    this.inputTipoContenedor = false;
    this.inputNumeroContenedor = false;
    this.inputYear = false;
    this.inputLocalizacion = false;
  }

  cerrarFormBusqueda() {
    this.busqueda = this.busquedaVacia;
    this.cerrarInputs();
    this.buttonCerrarBusqueda = false;
   this.cargarUltimosCincoContenedores();
  }
}