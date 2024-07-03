import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5';
import { LoginRegisterService } from 'src/app/servicios/loginRegister.service';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  exportAs: 'ngModel'
})

export class LoginComponent implements OnInit{
  @ViewChild('loginForm') mytemplateForm!: NgForm;

  public usuario: Usuario;
  public passwordEncrypted: any;

  constructor(private router: Router, private peticion: LoginRegisterService){
    this.usuario = <Usuario>{}
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("metidoInsert") == "2" || sessionStorage.getItem("cu") == "a" || sessionStorage.getItem("cu") == "i" || sessionStorage.getItem("cu") == "n")
      this.router.navigate(["/insertar"]);
    else 
      sessionStorage.setItem("metidoInsert", "1");
    
  }

  submitLogin(loginForm: Usuario) {
    const md5 = new Md5();
    this.passwordEncrypted = md5.appendStr(this.usuario.password).end();
    loginForm.password = this.passwordEncrypted;

    this.peticion.login(loginForm).subscribe(datos=>{
      if (datos.user == loginForm.user && datos.password == loginForm.password) {
        if (datos.tipo == 1)
          sessionStorage.setItem("cu", "a");
        else if (datos.tipo == 2)
          sessionStorage.setItem("cu", "n");
        else
          sessionStorage.setItem("cu", "i");
        
        Swal.fire({
          icon: 'success',
          title: '¡Logeado correctamente!',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(["/main"]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas!',
        })
        this.mytemplateForm.reset();
      }
    }, error=>console.log("Error al hacer login: ", error));
  }
}
