import { Component, OnInit } from '@angular/core';
import { SeriesDocumentales } from 'src/app/interfaces/series-documentales';
import { SeriesDocumentalesService } from 'src/app/servicios/seriesDocumentales.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-series-documentales',
  templateUrl: './series-documentales.component.html',
  styleUrls: ['./series-documentales.component.css']
})
export class SeriesDocumentalesComponent implements OnInit{
  
  public lista_SeriesDocumentales: Array<SeriesDocumentales> | undefined;
  
  public formNuevaSerieDocumental: Boolean = false;
  public formEditarSerieDocumental: Boolean = false;

  public tipoFormulario: string = "";
  public condicionUser: string = "";

  serieDocumental = new SeriesDocumentales(0, "", "", "", "", "", "");

  constructor(private peticion: SeriesDocumentalesService) {}

  ngOnInit(): void {
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
      
    this.condicionUser = environment.condicionUsuario;

    this.peticion.cargarSeriesDocumentales().subscribe(datos=>{
      this.lista_SeriesDocumentales = datos;
      if (this.lista_SeriesDocumentales == undefined || this.lista_SeriesDocumentales == null || this.lista_SeriesDocumentales.length == 0){
        this.tipoFormulario = "Añadir";
        this.formNuevaSerieDocumental = true;
      }
    },error=>console.log("Error al cargar la lista de series documentales: ",error));
  }

  editarSeriesDocumentales(serieDocumental: SeriesDocumentales){
    if (this.formNuevaSerieDocumental == true){
      this.formNuevaSerieDocumental = false;
    }
    this.tipoFormulario = "Editar";
    //this.serieDocumental = serieDocumental;
    this.formEditarSerieDocumental = true;
    this.peticion.cargarSerieDocumentalEspecifica(serieDocumental.ID_SERIE).subscribe(datos=>{
      this.serieDocumental = datos;
    },error=>console.log("Error al cargar los datos de la serie documental: ",error));
  }

  borrarSerieDocumental(serieDoc: SeriesDocumentales){
    Swal.fire({
      title: '¿Estás seguro de querer borrar esta serie documental?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.peticion.borrarSerieDocumental(serieDoc.ID_SERIE).subscribe(datos=>{
          this.lista_SeriesDocumentales = datos;
        },error=>console.log("Error al borrar la serie documental: ",error));
      }
    })
  }

  mostrarFormNuevaSerieDocumental(){
    console.log()
    if (this.formEditarSerieDocumental == true && this.formNuevaSerieDocumental == false)
      this.formEditarSerieDocumental = false;
    
    if (this.formEditarSerieDocumental == false && this.formNuevaSerieDocumental == true)
      this.formNuevaSerieDocumental = false;
    
    this.serieDocumental = new SeriesDocumentales(0, "", "", "", "", "", "");
    this.tipoFormulario = "Añadir";
    this.formNuevaSerieDocumental = !this.formNuevaSerieDocumental;
  }

  cerrarForm(){
    this.formEditarSerieDocumental = false;
    this.formNuevaSerieDocumental = false;
  }

  submitSerieDocumentalForm(serieDocumental: SeriesDocumentales){
    if (this.formNuevaSerieDocumental == true && this.formEditarSerieDocumental == false){
      Swal.fire({
        title: '¿Estás seguro de que quieres añadir esta serie documental?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Añadir'
      }).then((result) => {
        if (result.isConfirmed) {
          this.peticion.nuevaSerieDocumental(this.serieDocumental).subscribe(datos=>{
            this.lista_SeriesDocumentales = datos;
          },error=>console.log("Error al añadir la serie documental: ",error));
        }
      });
    } else {
      Swal.fire({
        title: '¿Estás seguro de que quieres editar esta serie documnetal?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Editar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.peticion.editarSerieDocumental(this.serieDocumental).subscribe(datos=>{
            this.lista_SeriesDocumentales = datos;
            this.formEditarSerieDocumental = false;
          },error=>console.log("Error al editar la serie documental: ",error)); 
        }
      });
    }
  }

}
