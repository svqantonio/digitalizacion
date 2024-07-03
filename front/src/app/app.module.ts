import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Componentes 
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { LoginComponent } from './componentes/login/login.component';
import { MainComponent } from './componentes/main/main.component';
import { RegisterComponent } from './componentes/register/register.component';
import { ListComponent } from './componentes/list/list.component';
import { UnidadesDocumentalesComponent } from './componentes/unidadesDocumentales/unidadesDocumentales.component';
import { SeriesDocumentalesComponent } from './componentes/series-documentales/series-documentales.component';
import { CreateComponent } from './componentes/create/create.component';
import { DocumentosAsociadosComponent } from './componentes/documentos-asociados/documentos-asociados.component';
import { DocumentosEditarComponent } from './componentes/documentos-editar/documentos-editar.component';
import { BusquedaComponent } from './componentes/busqueda/busqueda.component';

@NgModule({
  declarations: [
    AppComponent,
    UsuariosComponent,
    LoginComponent,
    MainComponent,
    RegisterComponent,
    ListComponent,
    UnidadesDocumentalesComponent,
    SeriesDocumentalesComponent,
    CreateComponent,
    DocumentosAsociadosComponent,
    DocumentosEditarComponent,
    BusquedaComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientJsonpModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
