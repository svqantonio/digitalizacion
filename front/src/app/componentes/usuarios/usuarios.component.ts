import { Component, OnInit } from '@angular/core';

//INTERFACES
import { TipoUser } from 'src/app/interfaces/tipo-user';
import { Usuario } from 'src/app/interfaces/usuario';

//SERVICIOS EXTERNOS
import Swal from 'sweetalert2';
import { Md5 } from 'ts-md5';

//SERVICIO
import { UsuariosService } from 'src/app/servicios/usuarios.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit{

  public listaUsuarios: Array<Usuario>;
  public listaTiposUsers: Array<TipoUser>;

  public banderaFormulario: boolean;

  public usuario = new Usuario(0, "", "", 0);

  constructor(private peticion: UsuariosService){
    this.listaUsuarios = [];
    this.listaTiposUsers = [];

    this.banderaFormulario = false;
  }

  ngOnInit(){
    this.peticion.listarUsuarios().subscribe(datos=>{
      this.listaUsuarios = datos;
    },error=>console.log("Error al listar usuarios: ", error));
    this.peticion.cargarTipos().subscribe(datos=>{
      this.listaTiposUsers = datos;
    },error=>console.log("Error al cargar tipos de usuarios: ",error));
  }

  borrarUsuario(user: Usuario){
    Swal.fire({
      title: "¿Estás seguro de que quieres BORRAR a: <u>" + user.user.toUpperCase() + "</u>?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.peticion.borrarUsuario(user.id).subscribe(datos=>{
          this.listaUsuarios = datos;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Usuario borrado correctamente!',
            showConfirmButton: true,
            timer: 2500
          });
        },error=>console.log("Error al borrar usuario: ", error));
      }
    });
  } 

  editarUsuario(editarUsuarioForm: any){
    Swal.fire({
      title: '¿Estás seguro de que quieres editar a ' + editarUsuarioForm.user + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const md5 = new Md5();
        this.usuario.password = (md5.appendStr(this.usuario.password).end() as string); 
        this.peticion.editarUsuario(this.usuario).subscribe(datos=>{
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Usuario editado correctamente!',
            showConfirmButton: true,
            timer: 2500
          });
          this.listaUsuarios = datos;
          this.banderaFormulario = !this.banderaFormulario;
        },error=>console.log("Error al modificar el usuario: ", error));
      }
    });
  }

  editarUser(userId: number){
    this.banderaFormulario = !this.banderaFormulario;
    this.peticion.datosUserSegunId(userId).subscribe(datos=>{
      this.usuario = datos;
    },error=>console.log("Error al listar al usuario segun sus datos"));
  }

  cerrarFormulario(){
    if (this.banderaFormulario == true)
      this.banderaFormulario = false;
  }
}
