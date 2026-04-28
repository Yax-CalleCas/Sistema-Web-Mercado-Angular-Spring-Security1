import { Component, OnInit } from '@angular/core';
import {PagosService} from "./PagoService";
import {PagoRequest} from "../../models/PagoRequest";


@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {

  pagos: any[] = [];
  loading = false;

  socioActual = {
    id: 1 // 🔥 aquí deberías traerlo del auth service
  };

  constructor(private pagosService: PagosService) {}

  ngOnInit(): void {
    this.cargarPagos();
  }

  // 📄 historial
  cargarPagos() {
    this.loading = true;

    this.pagosService.getPagosPorSocio(this.socioActual.id)
      .subscribe({
        next: (data: any) => {
          this.pagos = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  // 💳 iniciar pago
  pagar(puesto: any) {

    const data: PagoRequest = {
      socioId: this.socioActual.id,
      puestoId: puesto.id,
      monto: puesto.precioAlquiler,
      concepto: `Pago alquiler ${puesto.codigo}`
    };

    this.pagosService.crearCheckout(data)
      .subscribe((url: any) => {
        // 🔥 redirección a pasarela
        window.location.href = url;
      });
  }

  // 🧠 simular puesto (si no tienes backend aún)
  puestosDemo = [
    { id: 1, codigo: 'P-101', precioAlquiler: 150 },
    { id: 2, codigo: 'P-102', precioAlquiler: 200 }
  ];
}
