import {Component} from "@angular/core";
import {ReportesService} from "./reportes.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-reports',
  templateUrl: './reportes.component.html',
  standalone: true,
  imports: [
    FormsModule
  ],
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  fecha: string = '';
  socioId!: number;

  totalCaja: number = 0;
  deudas: any[] = [];

  constructor(private reportesService: ReportesService) {}

  obtenerCaja() {
    if (!this.fecha) return;

    this.reportesService.cajaDiaria(this.fecha).subscribe(res => {
      this.totalCaja = res;
    });
  }

  obtenerDeudas() {
    if (!this.socioId) return;

    this.reportesService.deudasPorSocio(this.socioId).subscribe(res => {
      this.deudas = res;
    });
  }
}
