import { Component, OnInit } from '@angular/core';
import { Documentos } from 'src/app/interfaces/documentos';
import { environment } from 'src/environments/environment.development';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import Swal from 'sweetalert2';
import { SeriesDocumentales } from 'src/app/interfaces/series-documentales';
import { Contenedores } from 'src/app/interfaces/contenedores';
import { TipoContenedor } from 'src/app/interfaces/tipo-contenedor';
import { Router } from '@angular/router';
import { SubirDocumento } from 'src/app/interfaces/subir-documento';
import { Busqueda } from 'src/app/interfaces/busqueda';
import { numbers } from '../documentos-editar/documentos-editar.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{

  public parametro: string = "";
  public condicionUser: string = "";

  //LISTAS
  public listaDocumentos: Array<Documentos>;
  public lista_seriesDocumentales: Array<SeriesDocumentales>;

  public lista_numeroContenedores: Array<numbers>;
  public lista_tiposContenedores: Array<TipoContenedor>;
  
  public documento: SubirDocumento;
  public serieDocumental: number;
  public contenedor: Contenedores;
  
  //BUSQUEDA
  public busqueda: Busqueda;
  public busquedaVacía: Busqueda; 
  public nPaginas: number = 0;

  public tipoContenedorSeleccionado: boolean = false;
  public inputSelect: Boolean = false;
  public inputObservaciones: Boolean = false;
  public inputNumExpediente: Boolean = false;
  public inputFecha: Boolean = false;
  public inputSerieDoc: boolean = false;
  public inputTipoContenedor: boolean = false;
  public inputNumeroContenedor: boolean = false;

  //PAGINACION
  public arrayButtons: Array<number> = [];
  public pagina: number = 0; 

  public isDisabledAnt: boolean = true;
  public isDisabledSig: boolean = false;

  public primeroOculto: boolean = false;
  public segundoOculto: boolean = true;
  public terceroOculto: boolean = true;
  public ultimaOculta: boolean = false;
  public auxiliarOculto: boolean = true;

  public isDisabledPrimeraPag: boolean = true;
  public isDisabledUltimaPag: boolean = false;


  constructor(private peticion: DocumentosService, private router: Router) {
    this.listaDocumentos = [];
    this.lista_seriesDocumentales = [];
    this.lista_numeroContenedores = [];
    this.lista_tiposContenedores = [];

    this.documento = <SubirDocumento>{};
    this.serieDocumental = <number>{};  
    this.contenedor = <Contenedores>{};

    this.busqueda = <Busqueda>{
      select: 0,
      serieDocumental: 0,
      tipoContenedor: 0,
      numeroContenedor: 0
    };
    this.busquedaVacía = <Busqueda>{
      select: 0,
      serieDocumental: 0,
      tipoContenedor: 0,
      numeroContenedor: 0
    };
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
      
    this.condicionUser = environment.condicionUsuario;

    this.peticion.cargarSeriesDocumentales().subscribe(datos=>{
      this.lista_seriesDocumentales = datos;
    },error=>console.log("Error al cargar series documentales: ",error));
    this.peticion.selectTipoContenedores().subscribe(datos=>{
      this.lista_tiposContenedores = datos;
    },error=>console.log("Error al cargar los tipos de contenedores: ",error));

    this.cargarDocumentos(this.pagina);
    
    this.peticion.devolverNumRegistros().subscribe(datos=>{
      this.nPaginas = Math.trunc(datos.REGISTROS / 15);
      let i = 0;

      while (i <= this.nPaginas){
        this.arrayButtons[i] = i;
        i++;
      }
    },error=>console.log("Error al devolver registros: ",error));
  }

  cambioTipoContenedor(tipoContenedor: number){
    this.inputNumeroContenedor = true;
    this.peticion.selectNumeroContenedor(tipoContenedor).subscribe(datos=>{
      this.lista_numeroContenedores = datos;
    },error=>console.log("Error al cargar los contenedores: "))
  }

  primeraPagina(){
    this.pagina = 0; 
    this.isDisabledAnt = true;
    this.isDisabledPrimeraPag = true;
    this.isDisabledSig = false;
    this.isDisabledUltimaPag = false;
    this.auxiliarOculto = true;
    this.primeroOculto = false;
    this.segundoOculto = true;
    this.terceroOculto = true;
    this.cargarDocumentos(this.pagina);
  }

  ultimaPagina() {
    if (this.primeroOculto == false || this.segundoOculto == false || this.terceroOculto == false)  {
      this.primeroOculto = true;
      this.segundoOculto = true;
      this.terceroOculto = true;

      this.isDisabledPrimeraPag = false;
      this.isDisabledAnt = false;
    }
    
    this.isDisabledSig = true;
    this.isDisabledUltimaPag = true;
    this.pagina = this.arrayButtons.length - 1;
    this.auxiliarOculto = false;

    this.cargarDocumentos(this.pagina);
  }

  botonesIntermedios(pagina: number) {
    if (pagina == 0) {
      this.primeroOculto = false;
      this.segundoOculto = true;
      this.terceroOculto = true;
    }    
    if (pagina == 1) {
      this.primeroOculto = true;
      this.segundoOculto = false; 
      this.terceroOculto = true;

      this.isDisabledPrimeraPag = false;
      this.isDisabledAnt = false;
      this.isDisabledUltimaPag = false;
      this.isDisabledSig = false;
    }
    if (pagina == 2) {
      this.primeroOculto = true;
      this.segundoOculto = true;
      this.terceroOculto = false;

      this.isDisabledPrimeraPag = false;
      this.isDisabledAnt = false;
      this.isDisabledUltimaPag = false;
      this.isDisabledSig = false;
    }
    if (this.auxiliarOculto == false)
      this.auxiliarOculto = !this.auxiliarOculto;

    this.pagina = pagina;
    this.cargarDocumentos(this.pagina);
  }

  controlAnt() {
    if (this.pagina - 1 == 1)
      this.isDisabledAnt = true;

    if (this.segundoOculto == false){
      this.segundoOculto = true;
      this.primeroOculto = false;

      this.isDisabledAnt = true;
      this.isDisabledPrimeraPag = true;
    } 

    if (this.terceroOculto == false){
      this.terceroOculto = true;
      this.segundoOculto = false;

      this.isDisabledAnt = false;
      this.isDisabledPrimeraPag = false;
    }

    if (this.pagina - 1 == 3){
      this.auxiliarOculto = true;
      this.primeroOculto = true;
      this.segundoOculto = true;
      
      this.terceroOculto = false;
    }

    this.pagina = this.pagina - 1;
    this.cargarDocumentos(this.pagina);
  }

  controlSig(){
    if (this.pagina + 1 == this.arrayButtons.length - 1) {
      this.isDisabledSig = true;
      this.isDisabledUltimaPag = true;
    } 

    if (this.pagina == 0) {
      this.isDisabledAnt = false;
      this.primeroOculto = true;
      this.segundoOculto = false;
      this.terceroOculto = true;
      this.isDisabledPrimeraPag = false;
    } 

    if (this.pagina == 1) {
      this.primeroOculto = true;
      this.segundoOculto = true;
      this.terceroOculto = false;
    } 

    if (this.pagina == 2){
      this.primeroOculto = true;
      this.segundoOculto = true;
      this.terceroOculto = true;
      this.auxiliarOculto = false;
    }
    this.pagina = this.pagina + 1;
    this.cargarDocumentos(this.pagina);
  }
  
  private cargarDocumentos(num: number): void {
    this.peticion.cargarLista_numeracion(num * 15).subscribe(datos=>{
      this.listaDocumentos = datos;
    },error=>console.log("Error al listar: ", error));
  }

  todosLosInputsOcultos() {
    this.inputObservaciones = false;
    this.inputFecha = false;
    this.inputNumExpediente = false;
    this.inputTipoContenedor = false;
    this.inputNumeroContenedor = false;
    this.inputSerieDoc = false;
    this.inputSelect = false;
  }

  seleccionarFiltroBusqueda(filtro: number) {
    if (filtro == 1) {
      this.inputObservaciones = true;
      this.inputFecha = false;
      this.inputNumExpediente = false;
      this.inputSerieDoc = false;
      this.inputTipoContenedor = false;
      this.inputNumeroContenedor = false;
    } else if (filtro == 2) {
      this.inputFecha = true;
      this.inputObservaciones = false;
      this.inputNumExpediente = false;
      this.inputSerieDoc = false;
      this.inputTipoContenedor = false;
      this.inputNumeroContenedor = false;
    } else if (filtro == 3){
      this.inputNumExpediente = true;
      this.inputFecha = false;
      this.inputObservaciones = false;
      this.inputSerieDoc = false;
      this.inputTipoContenedor = false;
      this.inputNumeroContenedor = false;
    } else if (filtro == 4){
      this.inputSerieDoc = true;
      this.inputNumExpediente = false;
      this.inputFecha = false;
      this.inputObservaciones = false;  
      this.inputTipoContenedor = false;
      this.inputNumeroContenedor = false;
    } else if (filtro == 5) {
      this.inputTipoContenedor = true;
      this.inputFecha = false;
      this.inputNumExpediente = false;
      this.inputObservaciones = false;
      this.inputSerieDoc = false;
    }
    this.inputSelect = true;
  }

  buscar() {
    if (this.inputObservaciones == true) { 
      this.router.navigate(["/busqueda"], {
        queryParams: {
          tipoBusqueda: 1,
          parametroBusqueda: this.busqueda.observaciones
        }
      });
    } else if (this.inputFecha == true){
      if (this.busqueda.fecha == undefined) {
        Swal.fire({
          title: '¡Tienes que introducir una fecha!',
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Vale'
        });
      } else {
        this.router.navigate(["/busqueda"], {
          queryParams: {
            tipoBusqueda: 2,
            parametroBusqueda: this.busqueda.fecha
          }
        });
      }
    } else if (this.inputNumExpediente == true) {
      this.router.navigate(["/busqueda"], {
        queryParams: {
          tipoBusqueda: 3,
          parametroBusqueda: this.busqueda.numExpediente
        }
      });
    } else if (this.inputSerieDoc == true) {
      if (this.busqueda.serieDocumental == 0) {
        Swal.fire({
          title: '¡No tienes bien seleccionado la serie documental!',
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Vale'
        });
      } else {
        this.router.navigate(["busqueda"], {
          queryParams: {
            tipoBusqueda: 4,
            parametroBusqueda: this.busqueda.serieDocumental
          }
        });
      }
    } else if (this.inputTipoContenedor == true && this.inputNumeroContenedor == true) {
      this.peticion.devolverContenedorPorNumero(this.busqueda.tipoContenedor, this.busqueda.numeroContenedor).subscribe(data=>{
        let idCont = data.NUMERO;

        this.router.navigate(["/busqueda"], {
          queryParams: {
            tipoBusqueda: 5,
            parametroBusqueda: idCont
          }
        });
      })
    } else if ((this.inputTipoContenedor == true && this.inputNumeroContenedor == false) || (this.inputTipoContenedor == false && this.inputNumeroContenedor == true)){
      Swal.fire({
        title: '¡No tienes bien seleccionado la unidad documental!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale'
      });
    }
  }

  borrarDoc(documento: Documentos) {
    Swal.fire({
      title: '¿Estás seguro de querer borrar este doc?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.peticion.borrarDocumentoList(documento.ID_DOCUMENTO).subscribe(datos=>{
          Swal.fire({
            title: '¡Documento borrado correctamente!',
            text: 'Pulse recargar para actualizar la lista.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Recargar'
          }).then((result) => {
            window.location.reload();
          });
        },error=>console.log("Error al borrar documento: ",error));
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '¡Borrado correctamente!',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
}
