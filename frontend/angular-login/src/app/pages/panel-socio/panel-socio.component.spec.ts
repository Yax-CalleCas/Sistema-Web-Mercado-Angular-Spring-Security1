import { Component, OnInit } from '@angular/core';
import { Socio } from "../socios/socios.model";
import { Puesto } from "../../models/puesto";
import { Pago } from "../../models/Pago";
import { PagoService } from "../pagos/PagoService";
import { PuestosService } from "../puestos/puestos/puestos.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-panel-socio',
  templateUrl: './panel-socio.component.html',
  styleUrls: ['./panel-socio.component.css']
})
export class PanelSocioComponent implements OnInit {
  socioActual: Socio | null = null;
  puestosDisponibles: Puesto[] = [];
  misPagos: Pago[] = [];

  constructor(
    private pagoService: PagoService,
    private puestoService: PuestosService
  ) {}

  ngOnInit(): void {
    const sesion = localStorage.getItem('usuario');
    if (sesion) {
      this.socioActual = JSON.parse(sesion);
      this.cargarCatalogo();
    }
  }

  cargarCatalogo(): void {
    this.puestoService.listar().subscribe({
      next: (data) => this.puestosDisponibles = data.filter(p => !p.socio)
    });
  }

  cargarMisPagos(): void {
    if (this.socioActual?.id) {
      this.pagoService.listarPorSocio(this.socioActual.id).subscribe({
        next: (data) => this.misPagos = data
      });
    }
  }

  confirmarAlquiler(puesto: Puesto): void {
    Swal.fire({
      title: '¿Confirmar Alquiler?',
      text: `Puesto: ${puesto.codigo} - S/. ${puesto.precioAlquiler}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Alquilar y pagar'
    }).then((result) => {
      if (result.isConfirmed && puesto.id && this.socioActual?.id) {
        this.pagoService.alquilar(puesto.id, this.socioActual.id).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', 'Ya puedes ocupar tu puesto.', 'success');
            this.cargarCatalogo();
          }
        });
      }
    });
  }

  imprimirRecibo(pago: Pago): void {
    Swal.fire('Descargando', `Recibo ${pago.concepto} en PDF...`, 'info');
  }
}
