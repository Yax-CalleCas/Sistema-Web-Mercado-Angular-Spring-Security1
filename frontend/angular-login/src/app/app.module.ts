import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Componentes Shared e Interfaz
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavComponent } from './shared/nav/nav.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Componentes de Páginas (Admin)
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PuestosComponent } from "./pages/puestos/puestos/puestos.component";
import { SocioComponent } from './pages/socios/socios.component';
import { DeudasComponent } from './pages/deudas/deudas.component';
import { PagosComponent } from './pages/pagos/pagos.component';
import { UsersComponent } from './pages/dashboard/users/users.component';

// Componentes de Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';

// Componentes de Socios (Vistas del Cliente)
import { PanelSocioComponent } from './pages/panel-socio/panel-socio.component';
import { MisRecibosComponent } from "./pages/socios/components/mis-recibos/mis-recibos.component";
import { CatalogoPuestosComponent } from "./pages/socios/components/catalogo-puestos/catalogo-puestos.component";

// Servicios de Seguridad
import { JwtInterceptorService } from './services/auth/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/auth/error-interceptor.service';

@NgModule({
  declarations: [
    // Se declara CADA componente UNA sola vez
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
    // Componentes del Socio
    PanelSocioComponent,
    MisRecibosComponent,
    CatalogoPuestosComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
