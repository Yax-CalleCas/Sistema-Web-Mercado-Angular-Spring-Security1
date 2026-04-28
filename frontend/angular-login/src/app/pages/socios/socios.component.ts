import { Component, OnInit } from '@angular/core';
import { SocioService } from "./socios.service";
import { Socio } from "./socios.model";
import { Puesto } from "../../models/puesto";
import Swal from 'sweetalert2';
import { Pago } from "../../models/Pago";

import { PuestoService } from "../puestos/puestos/puestos.service";
import {PagosService} from "../pagos/PagoService";
@Component({
  selector: 'app-socio',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SocioComponent implements OnInit {

  socios: Socio[] = [];
  puestosDisponibles: Puesto[] = [];
  misPagos: Pago[] = [];

  socio: Socio = this.nuevo();
  editando = false;

  socioActual: Socio | null = null;

  constructor(
    private socioService: SocioService,
    private pagoService: PagosService,
    private puestoService: PuestoService
  ) {}

  ngOnInit(): void {
    this.obtenerSocioSesion();
    this.listar();

    if (this.socioActual?.id) {
      this.cargarPuestosDisponibles();
      this.cargarMisPagos();
    }
  }

  // =========================
  // 🔐 SESIÓN
  // =========================
  obtenerSocioSesion(): void {
    const sesion = localStorage.getItem('usuario');
    if (sesion) this.socioActual = JSON.parse(sesion);
  }

  // =========================
  // 🧾 CRUD SOCIOS
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
  confirmarAlquiler(puesto: Puesto): void {

    // 🔐 validación segura
    if (!this.socioActual?.id || !puesto.id) {
      this.toast('error', 'Datos inválidos');
      return;
    }

    Swal.fire({
      title: '¿Confirmar Alquiler?',
      html: `
      <div class="text-start">
        <p><b>Puesto:</b> ${puesto.codigo}</p>
        <p><b>Monto:</b> S/. ${puesto.precioAlquiler}</p>
      </div>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar y Pagar',
      confirmButtonColor: '#10b981'
    }).then((result) => {

      if (!result.isConfirmed) return;

      // 🔐 doble seguridad
      if (!this.socioActual?.id || !puesto.id) {
        this.toast('error', 'Datos inválidos');
        return;
      }

      // 💳 llamada backend
      this.pagoService.alquilar(puesto.id, this.socioActual.id).subscribe({
        next: () => {
          Swal.fire('OK', 'Alquiler procesado correctamente', 'success');

          this.cargarPuestosDisponibles();
          this.cargarMisPagos();
        },
        error: () => {
          this.toast('error', 'Error al procesar pago');
        }
      });
    });
  }
  listar(): void {
    this.socioService.listar().subscribe({
      next: (data: Socio[]) => this.socios = data,
      error: () => this.toast('error', 'Error al listar socios')
    });
  }

  guardar(): void {
    const req = this.editando
      ? this.socioService.actualizar(this.socio.id!, this.socio)
      : this.socioService.crear(this.socio);

    req.subscribe({
      next: () => {
        this.toast('success', this.editando ? 'Actualizado' : 'Registrado');
        this.reset();
      },
      error: () => this.toast('error', 'Error al guardar')
    });
  }

  editar(s: Socio): void {
    this.socio = { ...s };
    this.editando = true;
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar?',
      icon: 'warning',
      showCancelButton: true
    }).then(r => {
      if (!r.isConfirmed) return;

      this.socioService.eliminar(id).subscribe(() => {
        this.listar();
        this.toast('success', 'Eliminado');
      });
    });
  }

  reset(): void {
    this.socio = this.nuevo();
    this.editando = false;
  }

  // =========================
  // 💳 PAGOS
  // =========================
  cargarMisPagos(): void {
    if (!this.socioActual?.id) return;

    this.pagoService.getPagosPorSocio(this.socioActual.id).subscribe({
      next: (data: Pago[]) => this.misPagos = data
    });
  }

  imprimirRecibo(pago: Pago): void {
    Swal.fire('Recibo', pago.concepto, 'info');
  }

  // =========================
  // 🏪 PUESTOS
  // =========================
  cargarPuestosDisponibles(): void {
    this.puestoService.listar().subscribe({
      next: (data: Puesto[]) => {
        this.puestosDisponibles = data.filter(p => !p.socio);
      }
    });
  }

  // =========================
  // 🔔 UTIL
  // =========================
  private toast(icon: 'success' | 'error', title: string) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      timer: 2000,
      showConfirmButton: false
    });
  }
}
