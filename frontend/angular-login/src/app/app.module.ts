import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Páginas
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PuestosComponent } from "./pages/puestos/puestos/puestos.component";
import { SocioComponent } from './pages/socios/socios.component';
import { DeudasComponent } from './pages/deudas/deudas.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { UsersComponent } from './pages/dashboard/users/users.component';
import { PanelSocioComponent } from './pages/panel-socio/panel-socio.component';

// NUEVAS PÁGINAS DE ADMINISTRACIÓN (Rutas corregidas)
import { ReportesComponent } from './pages/reportes/reportes.component';
import { GestionPagosComponent } from './pages/pagos/GestionPagosComponent'; // Ruta según tu lista de archivos

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

// Extras
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { MisRecibosComponent } from "./pages/socios/components/mis-recibos/mis-recibos.component";
import { CatalogoPuestosComponent } from "./pages/socios/components/catalogo-puestos/catalogo-puestos.component";

// Seguridad
import { JwtInterceptorService } from './services/auth/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/auth/error-interceptor.service';
import { DeudaService } from "./pages/deudas/deuda.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MainLayoutComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    DeudasComponent,
    PagosComponent,
    PuestosComponent,
    SocioComponent,
    PersonalDetailsComponent,
    UsersComponent,
    PanelSocioComponent,
    MisRecibosComponent,
    CatalogoPuestosComponent,
    AppComponent,
    HeaderComponent,
    ReportesComponent,
    GestionPagosComponent,
    ReportesComponent,
    GestionPagosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    DeudaService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
