import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class LoginRegisterService {

  private url_bbdd: string = environment.url_proyecto + environment.url_bbdd_loginRegister;

  constructor(private peticion: HttpClient) {}
  login(usuario: Usuario){
    let peticion = JSON.stringify({
      action: "loginUser",
      usuario: usuario
    });
    return this.peticion.post<Usuario>(this.url_bbdd, peticion);
  }

  register(usuario: Usuario){
    let peticion = JSON.stringify({
      action: "registerUser",
      usuario: usuario
    });
    return this.peticion.post(this.url_bbdd, peticion);
  }
}
