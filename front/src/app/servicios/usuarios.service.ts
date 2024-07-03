import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Usuario } from '../interfaces/usuario';
import { TipoUser } from '../interfaces/tipo-user';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url_bbdd_usuariosAdministracion: string = environment.url_proyecto + environment.url_bbdd_usuariosAdministracion;

  constructor(private peticion: HttpClient) { }

  listarUsuarios(){
    let peticion = JSON.stringify({
      action: "listarUsuarios"
    });
    return this.peticion.post<Usuario[]>(this.url_bbdd_usuariosAdministracion, peticion);
  }

  cargarTipos(){
    let peticion = JSON.stringify({
      action: "cargarTiposUsers"
    });
    return this.peticion.post<TipoUser[]>(this.url_bbdd_usuariosAdministracion, peticion);
  }

  borrarUsuario(usuario: number){
    let peticion = JSON.stringify({
      action: "borrarUsuario",
      usuario: usuario
    });
    console.log(peticion);
    return this.peticion.post<Usuario[]>(this.url_bbdd_usuariosAdministracion, peticion);
  }

  editarUsuario(usuario: Usuario){
    let peticion = JSON.stringify({
      action: "editarUsuario",
      usuario: usuario
    });
    return this.peticion.post<Usuario[]>(this.url_bbdd_usuariosAdministracion, peticion);
  }

  datosUserSegunId(id: number){
    let peticion = JSON.stringify({
      action: "datosUserSegunId",
      id: id
    });
    return this.peticion.post<Usuario>(this.url_bbdd_usuariosAdministracion, peticion);
  }
  
}
