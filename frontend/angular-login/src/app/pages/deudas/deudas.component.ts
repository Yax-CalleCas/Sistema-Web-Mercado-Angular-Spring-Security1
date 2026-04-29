import { Component, OnInit } from '@angular/core';
import {Deuda} from "../../models/Deuda";
import {DeudaService} from "./deuda.service";


@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.component.html'
})
export class DeudasComponent implements OnInit {

  deudas: Deuda[] = [];

  deuda: Deuda = {
    monto: 0,
    pagado: false,
    conceptoId: 0,
    puestoId: 0,
    socioId: 0
  };

  editando = false;
  mensaje = '';

  constructor(private deudaService: DeudaService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.deudaService.listar().subscribe({
      next: (data) => this.deudas = data,
      error: () => this.mensaje = 'Error al listar deudas'
    });
  }

  guardar(): void {
    if (this.editando && this.deuda.id) {
      this.deudaService.actualizar(this.deuda.id, this.deuda).subscribe({
        next: () => {
          this.reset();
          this.listar();
        }
      });
    } else {
      this.deudaService.crear(this.deuda).subscribe({
        next: () => {
          this.reset();
          this.listar();
        }
      });
    }
  }

  editar(d: Deuda): void {
    this.deuda = { ...d };
    this.editando = true;
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar deuda?')) return;

    this.deudaService.eliminar(id).subscribe(() => {
      this.listar();
    });
  }

  pagar(id: number): void {
    this.deudaService.marcarPagado(id).subscribe(() => {
      this.listar();
    });
  }

  reset(): void {
    this.deuda = {
      monto: 0,
      pagado: false,
      conceptoId: 0,
      puestoId: 0,
      socioId: 0
    };
    this.editando = false;
  }
}
