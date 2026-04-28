import { Component, Input, OnInit } from '@angular/core';
import { PuestoService } from "../../../puestos/puestos/puestos.service";
import { Puesto } from "../../../../models/puesto";
import Swal from 'sweetalert2';
import {PagosService} from "../../../pagos/PagoService";

@Component({
  selector: 'app-catalogo-puestos',
  templateUrl: './catalogo-puestos.component.html',
  styleUrls: ['./catalogo-puestos.component.css']
})
export class CatalogoPuestosComponent implements OnInit {

  @Input() socioActual: any;

  puestosDisponibles: Puesto[] = [];

  constructor(
    private puestoService: PuestoService,
    private pagoService: PagosService
  ) {}

  ngOnInit(): void {
    this.cargarPuestos();
  }

  cargarPuestos(): void {
    this.puestoService.listarDisponiblesNormales().subscribe({
      next: (res) => this.puestosDisponibles = res
    });
  }

  alquilar(puesto: Puesto): void {

    if (!this.socioActual?.id || !puesto.id) return;

    Swal.fire({
      title: 'Confirmar alquiler',
      text: `${puesto.codigo} - S/ ${puesto.precioAlquiler}`,
      icon: 'question',
      showCancelButton: true
    }).then(result => {

      if (!result.isConfirmed) return;

      this.pagoService.alquilar(puesto.id!, this.socioActual.id!).subscribe({
        next: () => {
          Swal.fire('OK', 'Alquiler realizado', 'success');
          this.cargarPuestos();
        },
        error: () => Swal.fire('Error', 'No se pudo alquilar', 'error')
      });
    });
  }
}
