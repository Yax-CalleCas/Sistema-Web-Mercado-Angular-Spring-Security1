import { Component, Input, OnInit } from '@angular/core';
import { Pago } from "../../../../models/Pago";
import { PagosService } from "../../../pagos/PagoService";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-recibos',
  templateUrl: './mis-recibos.component.html',
  styleUrls: ['./mis-recibos.component.css']
})
export class MisRecibosComponent implements OnInit {

  @Input() socioActual: any;
  recibos: Pago[] = [];
  loading: boolean = false;

  constructor(private pagosService: PagosService) { }

  ngOnInit(): void {
    if (this.socioActual && this.socioActual.id) {
      this.cargarRecibos();
    }
  }

  cargarRecibos() {
    this.loading = true;
    this.pagosService.getPagosPorSocio(this.socioActual.id).subscribe({
      next: (data) => {
        this.recibos = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error("Error al obtener recibos", err);
      }
    });
  }

  getStatusClass(estado: string): string {
    const status = estado ? estado.toUpperCase() : '';
    switch (status) {
      case 'APROBADO': return 'bg-success';
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'RECHAZADO':
      case 'FALLIDO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  imprimirRecibo(pago: Pago) {
    Swal.fire({
      title: 'Comprobante Electronico',
      icon: 'info',
      html: `
        <div class="text-start border-top pt-3">
          <p><b>Recibo N:</b> 00${pago.id}</p>
          <p><b>Concepto:</b> ${pago.concepto}</p>
          <p><b>Fecha:</b> ${new Date(pago.fechaPago).toLocaleDateString()}</p>
          <p><b>Metodo:</b> ${pago.metodoPago}</p>
          <hr>
          <h4 class="text-end text-primary">Total: S/ ${pago.montoTotal.toFixed(2)}</h4>
        </div>
      `,
      showCloseButton: true,
      confirmButtonText: 'Imprimir PDF',
      confirmButtonColor: '#0d6efd'
    }).then((result) => {
      if (result.isConfirmed) {
        window.print();
      }
    });
  }
}
