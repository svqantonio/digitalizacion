import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{

  public condicionUser: string = "";

  constructor(private router: Router){}

  ngOnInit(){
    if (sessionStorage.getItem("cu") == "a")
      environment.condicionUsuario = "Administrador";
    
    else if (sessionStorage.getItem("cu") == "n")
      environment.condicionUsuario = "Normal";
    
    else 
      environment.condicionUsuario = "Insercion";
    
    this.condicionUser = environment.condicionUsuario;

    if (sessionStorage.getItem("metidoInsert") == "2")
      this.router.navigate(["insertar"]); 
  }

  removerSessions(){
    sessionStorage.removeItem("metidoInsert");
    sessionStorage.removeItem("idDoc");
    sessionStorage.removeItem("cu");
  }
  
  logout(){
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Cerrada la sesión!',
        )
        this.removerSessions();
        this.router.navigate([""]);
      }
    })
  }
}
