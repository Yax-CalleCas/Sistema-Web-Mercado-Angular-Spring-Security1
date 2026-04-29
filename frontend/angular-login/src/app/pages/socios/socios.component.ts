import { Component, OnInit } from '@angular/core';
import { SocioService } from "./socios.service";
import { Socio } from "./socios.model";
import { Puesto } from "../../models/puesto";
import { Pago } from "../../models/Pago";
import { PuestoService } from "../puestos/puestos/puestos.service";
import { PagosService } from "../pagos/PagoService";
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-socio',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SocioComponent implements OnInit {

  // Listas
  socios: Socio[] = [];
  puestosDisponibles: Puesto[] = [];
  misPagos: Pago[] = [];

  // Estados
  socio: Socio = this.nuevo();
  socioActual: any = null;
  editando = false;
  loading = false;

  constructor(
    private socioService: SocioService,
    private pagoService: PagosService,
    private puestoService: PuestoService
  ) {}

  ngOnInit(): void {
    this.obtenerSocioSesion();

    // MEJORA: Cargamos la lista de socios inmediatamente si eres ADMIN o si no hay sesión activa
    // para asegurar que la tabla no aparezca vacía al iniciar.
    if (this.esAdmin() || !this.socioActual) {
      this.listar();
    }

    // Si hay un socio logueado (sea Admin o User), cargamos su perfil personal
    if (this.socioActual && this.socioActual.id) {
      this.cargarDatosSocio();
    }
  }

  // =========================
  // 🔐 SEGURIDAD Y SESIÓN
  // =========================
  obtenerSocioSesion(): void {
    const sesion = localStorage.getItem('usuario');
    if (sesion) {
      this.socioActual = JSON.parse(sesion);
      console.log("Sesión activa detectada:", this.socioActual);
    }
  }

  // Método centralizado para validar ADMIN (Cubre ambas versiones del backend)
  esAdmin(): boolean {
    return this.socioActual?.role === 'ADMIN' || this.socioActual?.role === 'ROLE_ADMIN';
  }

  cargarDatosSocio(): void {
    this.loading = true;
    this.cargarPuestosDisponibles();
    this.cargarMisPagos();
    this.loading = false;
  }

  // =========================
  // 🧾 CRUD DE SOCIOS (ADMIN)
  // =========================
  nuevo(): Socio {
    return {
      nombres: '',
      apellidos: '',
      dni: '',
      telefono: '',
      direccion: '',
      fotoUrl: '',
      username: '',
      password: '',
      role: 'USER'
    };
  }

  listar(): void {
    this.loading = true;
    this.socioService.listar().subscribe({
      next: (data: Socio[]) => {
        this.socios = data;
        this.loading = false;
        console.log("Socios cargados exitosamente");
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al listar:', err);
        if (err.status === 403) {
          console.warn("Acceso denegado: Se requiere rol ADMIN para ver la lista completa.");
        }
      }
    });
  }

  guardar(): void {
    const req = this.editando
      ? this.socioService.actualizar(this.socio.id!, this.socio)
      : this.socioService.crear(this.socio);

    req.subscribe({
      next: () => {
        this.toast('success', this.editando ? 'Datos actualizados' : 'Socio registrado');
        this.listar(); // Recarga la tabla para ver el cambio
        this.reset();
      },
      error: (err) => {
        console.error(err);
        this.toast('error', 'Error al procesar la solicitud');
      }
    });
  }

  editar(s: Socio): void {
    // Usamos el operador spread para no modificar el objeto de la lista directamente
    this.socio = { ...s };
    this.editando = true;
    // Scroll suave hacia el formulario para facilitar la edición
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el socio y sus credenciales de acceso",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(r => {
      if (r.isConfirmed) {
        this.socioService.eliminar(id).subscribe({
          next: () => {
            this.listar();
            this.toast('success', 'Socio eliminado');
          },
          error: () => this.toast('error', 'No se pudo eliminar el socio')
        });
      }
    });
  }

  reset(): void {
    this.socio = this.nuevo();
    this.editando = false;
  }

  // =========================
  // 💳 PAGOS Y PUESTOS
  // =========================
  cargarMisPagos(): void {
    if (!this.socioActual?.id) return;
    this.pagoService.getPagosPorSocio(this.socioActual.id).subscribe({
      next: (data: Pago[]) => this.misPagos = data,
      error: (err) => console.error("Error en pagos:", err)
    });
  }

  confirmarAlquiler(puesto: Puesto): void {
    if (!this.socioActual?.id) {
      Swal.fire('Error', 'Debes iniciar sesión para alquilar', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmar Alquiler',
      text: `¿Deseas alquilar el puesto ${puesto.codigo} por S/ ${puesto.precioAlquiler}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar Pago',
      confirmButtonColor: '#10b981'
    }).then((result) => {
      if (result.isConfirmed) {
        // Cambia .alquilar por .crearCheckout
        this.pagoService.crearCheckout({
          puestoId: puesto.id,
          socioId: this.socioActual.id,
          monto: puesto.precioAlquiler,
          concepto: 'Alquiler de Puesto ' + puesto.codigo
        }).subscribe({
          next: (url) => {
            window.location.href = url; // Redirige a Stripe
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  cargarPuestosDisponibles(): void {
    this.puestoService.listar().subscribe({
      next: (data: Puesto[]) => {
        this.puestosDisponibles = data.filter(p => p.socio == null);
      }
    });
  }
// Añade estas variables dentro de la clase
  puestoSeleccionado: any = null;
  fotosArray: string[] = [];

// Añade este método para que funcione el modal
  verDetalle(p: any): void {
    this.puestoSeleccionado = { ...p };

    if (p.fotosGaleria) {
      // Convertimos el string de la DB en un arreglo para el *ngFor de la galería
      this.fotosArray = p.fotosGaleria.split(',').map((url: string) => url.trim());
    } else {
      this.fotosArray = [];
    }

    // Abrimos el modal (Asegúrate de que 'bootstrap' esté declarado arriba)
    const modalElement = document.getElementById('detalleModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  cambiarFotoPrincipal(url: string): void {
    this.puestoSeleccionado.imagenUrl = url;
  }
  imprimirRecibo(pago: Pago): void {
    Swal.fire({
      title: 'Comprobante Digital',
      html: `
        <div style="text-align: left;">
          <hr>
          <p><b>Recibo N°:</b> ${pago.id}</p>
          <p><b>Socio:</b> ${this.socioActual?.nombres || 'Socio'}</p>
          <p><b>Concepto:</b> ${pago.concepto}</p>
          <p><b>Monto:</b> S/ ${pago.montoTotal.toFixed(2)}</p>
          <p><b>Fecha:</b> ${new Date(pago.fechaPago).toLocaleDateString()}</p>
        </div>
      `,
      icon: 'info'
    });
  }

  private toast(icon: 'success' | 'error', title: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true
    });
  }
}
