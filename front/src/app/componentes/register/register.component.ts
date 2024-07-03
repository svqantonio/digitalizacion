import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

//Interfaces
import { Usuario } from 'src/app/interfaces/usuario';
import { TipoUser } from 'src/app/interfaces/tipo-user';

//Services
import { LoginRegisterService } from 'src/app/servicios/loginRegister.service';

//MD5
import { Md5 } from 'ts-md5';
import Swal from 'sweetalert2';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  @ViewChild('registerForm') myTemplateForm!: NgForm;

  public tipo: TipoUser;
  public usuario: Usuario;

  private passwordEncrypted: any;

  constructor(private peticion: LoginRegisterService, private router: Router){
    this.usuario = <Usuario>{}
    this.tipo = <TipoUser>{}
  }

  ngOnInit(){ 
    if (this.usuario.tipo == undefined) 
      this.usuario.tipo = 0;
  }

  submitRegister(registerForm: Usuario){
    const md5 = new Md5();
    this.passwordEncrypted = md5.appendStr(this.usuario.password).end();
    registerForm.password = this.passwordEncrypted;

    Swal.fire({
      title: '¿Estás seguro de que quieres añadir a ' + registerForm.user + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (registerForm.tipo == 0 || registerForm.tipo == undefined) {
          Swal.fire({
            title: 'Error',
            text: '¡Tienes que seleccionar un tipo de usuario!',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Vale'
          }).then((result) => {
            if (result.isConfirmed){
              this.usuario.tipo = 0;
              this.myTemplateForm.reset();
            }  
          });
        } else {
          this.peticion.register(registerForm).subscribe(datos=>{
            if (registerForm.tipo == 1)
              sessionStorage.setItem("cu", "a");
            else if (registerForm.tipo == 2)
              sessionStorage.setItem("cu", "n");
            else if (registerForm.tipo == 3)
              sessionStorage.setItem("cu", "i");
            
            this.router.navigate(["/main"]);
          },error=>console.log("Error registering user: ",error));  
        }
      }
    });
  }
}
