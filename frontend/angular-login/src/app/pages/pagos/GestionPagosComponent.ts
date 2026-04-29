import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import {PagosService} from "./PagoService";

@Component({
  selector: 'app-gestion-pagos',
  standalone: false,
  templateUrl: './gestion-pagos.component.html'
})
export class GestionPagosComponent implements OnInit {

  pagosPendientes: any[] = [];
  loading = false;

  constructor(private pagosService: PagosService) {}

  ngOnInit(): void {
    this.listarPendientes();
  }

  listarPendientes() {
    this.loading = true;
    this.pagosService.getPagosPendientes().subscribe({
      next: (data) => {
        this.pagosPendientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error al cargar pendientes", err);
        this.loading = false;
      }
    });
  }

  confirmarAprobacion(pago: any) {
    if (confirm(`¿Deseas aprobar el pago de S/. ${pago.montoTotal} para el ${pago.concepto}?`)) {
      this.pagosService.aprobarPago(pago.id).subscribe({
        next: () => {
          alert('¡Pago aprobado exitosamente!');
          this.listarPendientes(); // Refresca la lista
        },
        error: (err) => alert('Hubo un error al aprobar el pago.')
      });
    }
  }
}
