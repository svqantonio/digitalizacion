import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//COMPONENTES
import { ListComponent } from './componentes/list/list.component';
import { LoginComponent } from './componentes/login/login.component';
import { MainComponent } from './componentes/main/main.component';
import { RegisterComponent } from './componentes/register/register.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { UnidadesDocumentalesComponent } from './componentes/unidadesDocumentales/unidadesDocumentales.component';
import { SeriesDocumentalesComponent } from './componentes/series-documentales/series-documentales.component';
import { CreateComponent } from './componentes/create/create.component';
import { DocumentosAsociadosComponent } from './componentes/documentos-asociados/documentos-asociados.component';
import { DocumentosEditarComponent } from './componentes/documentos-editar/documentos-editar.component';
import { BusquedaComponent } from './componentes/busqueda/busqueda.component';


const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "insertar", component: CreateComponent },
  { path: "usuarios", component: UsuariosComponent },
  { path: "main", component: MainComponent },
  { path: "registrarse", component: RegisterComponent },
  { path: "list", component: ListComponent },
  { path: "contenedores", component: UnidadesDocumentalesComponent },
  { path: "seriesDocumentales", component: SeriesDocumentalesComponent },
  { path: "documentosAsociados/:id", component: DocumentosAsociadosComponent },
  { path: "documento/:id", component: DocumentosEditarComponent },
  { path: "busqueda", component: BusquedaComponent, data: {tipoBusqueda: 'tipoBusqueda', parametroBusqueda: 'parametroBusqueda'} }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
