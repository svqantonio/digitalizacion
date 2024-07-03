import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Documentos } from 'src/app/interfaces/documentos';
import { BusquedaService } from 'src/app/servicios/busqueda.service';
import { DocumentosService } from 'src/app/servicios/documentos.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit{

  public condicionUser: string;
  public listaDocumentos: Array<Documentos>;
  public tablaBusqueda: boolean = true;

  public tipoBusqueda: number;
  public parametroBusqueda: any;

  //PAGINACION
  public numeroBotonesPaginacion: Array<number>;
  public paginacion: boolean = true;
  public pagina: number = 0;
  public isDisabledPrimeraPagina: boolean = true;
  public isDisabledAnt: boolean = true;
  public primeroNoSeleccionado: boolean = false;
  public segundoNoSeleccionado: boolean = true; 
  public segundoDisabled: boolean = false;
  public terceroNoSeleccionado: boolean = true;
  public terceroDisabled: boolean = false;
  public isDisabledSig: boolean = false;
  public isDisabledUltimaPagina: boolean = false;
  public auxiliarOculto: boolean = true;

  constructor(private route: ActivatedRoute, private peticion: BusquedaService, private router: Router, private peticionDocService: DocumentosService) {
    this.condicionUser = "";
    this.tipoBusqueda = 0;
    this.listaDocumentos = [];
    this.numeroBotonesPaginacion = [];
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
      
    this.condicionUser = environment.condicionUsuario;

    this.route.queryParams.subscribe(params=>{
      this.tipoBusqueda = params['tipoBusqueda'],
      this.parametroBusqueda = params['parametroBusqueda']
    }); 

    this.cargarDatosBusqueda();
  }

  cargarDatosBusqueda() {
    if (this.tipoBusqueda == 1)
      if (this.parametroBusqueda == undefined)
        this.peticion.cuantosRegistrosHayPorBusqueda_observaciones(undefined).subscribe(datos=>{
          if (datos.NUMERO == 0)
            this.noHayDocs();
          else 
            this.hayRegistrosSuficientes(datos.NUMERO);
        },error=>console.log("Error al devolver número de registros buscando observaciones: ", error));
      else 
        this.peticion.cuantosRegistrosHayPorBusqueda_observaciones(this.parametroBusqueda).subscribe(datos=>{
          if (datos.NUMERO == 0) 
            this.noHayDocs();
          else 
            this.hayRegistrosSuficientes(datos.NUMERO);
        },error=>console.log("Error al devolver el número de registros por observaciones: ", error));

    if (this.tipoBusqueda == 2)
      this.peticion.cuantosRegistrosHayPorBusqueda_fecha(this.parametroBusqueda).subscribe(datos=>{
        if (datos.NUMERO == 0)
          this.noHayDocs();
        else 
          this.hayRegistrosSuficientes(datos.NUMERO);
      },error=>console.log("Error al devolver el número de registro en la búsqueda por fecha: ", error));

    if (this.tipoBusqueda == 3) 
      this.peticion.cuantosRegistrosHayPorBusqueda_numExpediente(this.parametroBusqueda).subscribe(datos=>{
        if (datos.NUMERO == 0) 
          this.noHayDocs();
        else 
          this.hayRegistrosSuficientes(datos.NUMERO);
      },error=>console.log("Error al devolver el número de registro en la búsqueda por número de expediente: ", error));

    if (this.tipoBusqueda == 4)
      this.peticion.cuantosRegistrosHayPorBusqueda_serieDocumental(this.parametroBusqueda).subscribe(datos=>{
        if (datos.NUMERO == 0)
          this.noHayDocs();
        else 
          this.hayRegistrosSuficientes(datos.NUMERO);
        
      },error=>console.log("Error al devolver número de registros al buscar por serie documental: ", error));

    if (this.tipoBusqueda == 5) {
      this.peticion.cuantosRegistrosHayPorBusqueda_unidadDocumental(this.parametroBusqueda).subscribe(datos=>{
        if (datos.NUMERO == 0)
          this.noHayDocs();
        else 
          this.hayRegistrosSuficientes(datos.NUMERO);
      },error=>console.log("Error al devolver número de registros al buscar por unidad documental: ", error));
    }
  }

  borrarDoc(doc: Documentos) {
    Swal.fire({
      title: '¿Estás seguro de que quieres borrar este documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) 
        this.peticionDocService.borrarDocumentoList(doc.ID_DOCUMENTO).subscribe(datos=>{
          this.peticionArchivos(this.pagina);
        },error=>console.log("Error al borrar documento: ", error));
    });
  }

  controlAnt() {
    if (this.segundoNoSeleccionado == false) {
      this.primeroNoSeleccionado = false;
      this.segundoNoSeleccionado = true;
      this.terceroNoSeleccionado = true;
      this.isDisabledAnt = true;
      this.isDisabledPrimeraPagina = true;
      this.isDisabledSig = false;
    }

    if (this.terceroNoSeleccionado == false) { 
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = false;
      this.terceroNoSeleccionado = true;
    }

    if (this.primeroNoSeleccionado == true && this.segundoNoSeleccionado == true && this.terceroNoSeleccionado == true && this.pagina == 3) {
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = true;
      this.terceroNoSeleccionado = false;
      this.auxiliarOculto = true;
    }
    
    this.pagina  = this.pagina - 1;
    this.peticionArchivos(this.pagina);
  }

  primeraPagina() {
    this.isDisabledPrimeraPagina = true;
    this.primeroNoSeleccionado = false;
    this.segundoNoSeleccionado = true;
    this.terceroNoSeleccionado = true;
    this.isDisabledAnt = true;
    this.auxiliarOculto = true;
    this.isDisabledSig = false;
    this.isDisabledUltimaPagina = false;
    this.pagina = 0;
    this.peticionArchivos(0);
  }

  ultimaPagina() {    
    this.primeroNoSeleccionado = false;
    this.segundoNoSeleccionado = true;
    this.terceroNoSeleccionado = true;
    this.isDisabledAnt = false;
    this.isDisabledPrimeraPagina = false;
    this.isDisabledSig = true;
    this.isDisabledUltimaPagina = true;
    this.auxiliarOculto = false;
    this.pagina = this.numeroBotonesPaginacion.length - 1;
    this.peticionArchivos(this.pagina);
  }

  controlSig() {
    if (this.pagina + 1 == this.numeroBotonesPaginacion.length - 1) {
      this.isDisabledSig = true;
      this.isDisabledUltimaPagina = true;
    }
    if (this.pagina == 0) {
      this.isDisabledAnt = false;
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = false;
      this.terceroNoSeleccionado = true;
      this.isDisabledPrimeraPagina = false;
    } 
    if (this.pagina == 1) {
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = true;
      this.terceroNoSeleccionado = false;
    } 
    if (this.pagina == 2) {
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = true;
      this.terceroNoSeleccionado = true;
      this.auxiliarOculto = false;
    } 

    if (this.terceroDisabled == true) {
      this.isDisabledSig = true;
      this.isDisabledUltimaPagina = true;
    }

    this.pagina = this.pagina + 1;
    this.peticionArchivos(this.pagina);
  }

  hayRegistrosSuficientes(datos: any) {
    if (datos < 15) {
      this.segundoDisabled = true;
      this.terceroDisabled = true;
      this.isDisabledUltimaPagina = true;
      this.isDisabledSig = true;
    }

    if (datos < 30) { 
      this.terceroDisabled = true;
      this.isDisabledUltimaPagina = true;
    }
    else 
      this.rellenarArrayPaginacion(datos);

    this.peticionArchivos(0);
  }

  rellenarArrayPaginacion(datos: any) {
    this.numeroBotonesPaginacion = Array(Math.ceil(datos / 15));

    for (var i = 0; i < this.numeroBotonesPaginacion.length; i++)
      this.numeroBotonesPaginacion[i] = i;
  }

  peticionArchivos(pagina: number) {
    if (this.tipoBusqueda == 1)
      this.peticion.buscarPorObservaciones(this.parametroBusqueda, pagina * 15).subscribe(datos=>{
        this.listaDocumentos = datos;
      },error=>console.log("Error al buscar por observaciones: ", error));

    if (this.tipoBusqueda == 2) 
      this.peticion.buscarDocsPorFecha_offset(this.parametroBusqueda, pagina * 15).subscribe(datos=>{
        this.listaDocumentos = datos;
      },error=>console.log("Error al cargar docs por fechas con el offset: ", error));
    
    if (this.tipoBusqueda == 3)
      this.peticion.buscarPorNumExpediente(this.parametroBusqueda, pagina * 15).subscribe(datos=>{
        this.listaDocumentos = datos;
      },error=>console.log("Error al buscar por número de expediente: ", error));

    if (this.tipoBusqueda == 4) 
      this.peticion.buscarDocsPorSerieDoc(this.parametroBusqueda, pagina * 15).subscribe(datos=>{
        this.listaDocumentos = datos;
      },error=>console.log("Error al cargar docs por series documentales con el offset: ", error)); 
      
    if (this.tipoBusqueda == 5)
      this.peticion.buscarPorUnidadDoc(this.parametroBusqueda, pagina * 15).subscribe(datos=>{
        this.listaDocumentos = datos;
      },error=>console.log("Error al cargar docs por unidades documentales con el offset: ", error)); 
  }

  controlesTresPrimerosBotones(pagina: number) {
    if (pagina == 0) {
      this.primeroNoSeleccionado = false;
      this.segundoNoSeleccionado = true;
      this.terceroNoSeleccionado = true;
      this.isDisabledAnt = true;
      this.isDisabledPrimeraPagina = true;
    }
    if (pagina == 1) {
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = false;
      this.terceroNoSeleccionado = true;
      this.isDisabledAnt = false;
      this.isDisabledPrimeraPagina = false;
    }

    if (pagina == 2) {
      this.primeroNoSeleccionado = true;
      this.segundoNoSeleccionado = true;
      this.terceroNoSeleccionado = false;
      this.isDisabledAnt = false;
      this.isDisabledPrimeraPagina = false;
    }
    
    if (this.auxiliarOculto == false)
      this.auxiliarOculto = !this.auxiliarOculto;

    if (this.isDisabledSig == true || this.isDisabledUltimaPagina == true) {
      this.isDisabledSig = !this.isDisabledSig;
      this.isDisabledUltimaPagina = !this.isDisabledUltimaPagina;
    }
    this.pagina = pagina;
    this.peticionArchivos(this.pagina);
  }

  noHayDocs() {
    this.tablaBusqueda = !this.tablaBusqueda;

    if (this.tipoBusqueda == 1)
      Swal.fire({
        title: '¡No hay documentos con esta observación!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale',
      }).then((result) => {
        this.router.navigate(["/list"]);
      });

    if (this.tipoBusqueda == 2)
      Swal.fire({
        title: '¡No hay documentos con esta fecha!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale',
      }).then((result) => {
        this.router.navigate(["/list"]);
      });

    if (this.tipoBusqueda == 3) 
      Swal.fire({
        title: '¡No hay documentos con este número de expediente!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale',
      }).then((result) => {
        this.router.navigate(["/list"]);
      });

    if (this.tipoBusqueda == 4)
      Swal.fire({
        title: '¡No hay documentos con esta serie documental!',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Vale',
      }).then((result) => {
        this.router.navigate(["/list"]);
      });
  }

  volver() {
    Swal.fire({
      title: '¿Estás seguro de que quieres volver a la lista normal?',
      text: 'Vas a cerrar el cuadro de búsqueda...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Volver',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed)
        this.router.navigate(["/list"]);
    });
  }
}