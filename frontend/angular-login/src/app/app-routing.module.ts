import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SocioComponent } from './pages/socios/socios.component';
import { PuestosComponent } from './pages/puestos/puestos/puestos.component';
import { DeudasComponent } from './pages/deudas/deudas.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { UsersComponent } from "./pages/dashboard/users/users.component";
import { PanelSocioComponent } from "./pages/panel-socio/panel-socio.component";
import { AuthGuard } from './services/auth/auth.guard';




import { ReportesComponent } from './pages/reportes/reportes.component';
import {GestionPagosComponent} from "./pages/pagos/GestionPagosComponent";

const routes: Routes = [
  { path: '', redirectTo: 'iniciar-sesion', pathMatch: 'full' },
  { path: 'iniciar-sesion', component: LoginComponent },
  { path: 'registrarse', component: RegisterComponent },
  {
    path: 'deudas',
    component: DeudasComponent // ADMIN
  },
  {
    path: 'mis-deudas',
    component: DeudasComponent // USER
  },
  { path: 'reportes', component: ReportesComponent },
  { path: 'gestion-pagos', component: GestionPagosComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'inicio', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'mi-panel-socio', component: PanelSocioComponent }, // Vista Socio
      { path: 'socios', component: SocioComponent },             // Vista Admin
      { path: 'puestos', component: PuestosComponent },           // Vista Admin
      { path: 'deudas', component: DeudasComponent },             // Vista General
      { path: 'mis-deudas', component: DeudasComponent },         // Alias para Socio en Nav
      { path: 'pagos', component: PagosComponent },
      { path: 'admin/users', component: UsersComponent },
      {
        path: 'reportes',
        loadChildren: () => import('./pages/reportes/reportes.module').then(m => m.ReportesModule)
      },
    ]
  },

  { path: '**', redirectTo: 'iniciar-sesion' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
