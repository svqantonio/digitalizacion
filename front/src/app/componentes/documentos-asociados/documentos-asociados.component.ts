import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocsAsociadosService } from 'src/app/servicios/docsAsociados.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.development';
import { SubirDocumento } from 'src/app/interfaces/subir-documento';


@Component({
  selector: 'app-documentos-asociados',
  templateUrl: './documentos-asociados.component.html',
  styleUrls: ['./documentos-asociados.component.css']
})
export class DocumentosAsociadosComponent implements OnInit{

  private idContenedor: number;
  public condicionUser: string;
  public lista_documentosDevueltos_contenedorSeleccionado: Array<SubirDocumento>;

  constructor(private peticion: DocsAsociadosService, private route: ActivatedRoute, private router: Router) {
    this.idContenedor = 0;
    this.lista_documentosDevueltos_contenedorSeleccionado = [];
    this.condicionUser = "";
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
    
    this.condicionUser = environment.condicionUsuario;

    this.idContenedor = this.route.snapshot.params["id"];
    this.peticion.devolverDocumentos_contenedorSeleccionado(this.idContenedor).subscribe(datos=>{
      this.lista_documentosDevueltos_contenedorSeleccionado = datos;

      if (this.lista_documentosDevueltos_contenedorSeleccionado.length == 0){
        Swal.fire({
          title: '¡No hay documentos dentro de esta unidad contenedora!',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Vale'
        }).then((result) => {
          if (result.isConfirmed) 
            this.router.navigate(["contenedores"]);
        });
      }
    },error=>console.log("Error al listar los documentos provenientes del contenedor: ",error));
  }

  borrarDoc(doc: any) {
    Swal.fire({
      title: '¿Estás seguro de querer borrar el documento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.peticion.borrarDocumento(doc.ID_DOCUMENTO).subscribe(datos=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Borrado correctamente',
            showConfirmButton: false,
            timer: 2500,
          });
          this.peticion.devolverDocumentos_contenedorSeleccionado(this.idContenedor).subscribe(datos=>{
            if (datos.length == 0) 
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Borrado correctamente',
              showConfirmButton: false,
              timer: 2500,
            }).then((result) => {
              this.router.navigate(["/contenedores"]);
            });
            else 
              this.lista_documentosDevueltos_contenedorSeleccionado = datos;
          },error=>console.log("Error al devolver los documentos: ", error));
        },error=>console.log("Error al borrar el documento: ", error));
      }
    });
  }
}
