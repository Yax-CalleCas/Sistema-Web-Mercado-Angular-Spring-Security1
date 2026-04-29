import { Component, OnInit } from "@angular/core";
import { ReportesService } from "./reportes.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-reports',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  today = new Date();
  stats: any = {
    ingresosTotales: 0,
    totalPuestos: 0,
    puestosOcupados: 0,
    porcentajeOcupacion: 0,
    recaudacionServicios: 0,
    porConcepto: []
  };

  listaSocios: any[] = [];
  historialReportes: any[] = []; // 🔥 Variable para la tabla de historial

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarReporteSocios();
    this.cargarHistorial(); // 🔥 Cargar historial al iniciar
  }


// En reportes.component.ts
  fechaInicio: string = '';
  fechaFin: string = '';

  cargarDashboard() {
    const params: any = {};
    if (this.fechaInicio) params.inicio = this.fechaInicio;
    if (this.fechaFin) params.fin = this.fechaFin;

    this.reportesService.getDashboardStats(params).subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error("Error cargando stats", err)
    });
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.cargarDashboard();
  }

  cargarReporteSocios() {
    this.reportesService.getSociosReport().subscribe({
      next: (data) => this.listaSocios = data,
      error: (err) => console.error("Error cargando socios", err)
    });
  }

  // 🔥 NUEVAS FUNCIONES
  cargarHistorial() {
    this.reportesService.getHistorialReportes().subscribe({
      next: (data) => this.historialReportes = data,
      error: (err) => console.error("Error cargando historial", err)
    });
  }

  generarYGuardarReporte() {
    if(confirm('¿Estás seguro de que deseas guardar el cierre actual del mercado?')) {
      this.reportesService.guardarCierre().subscribe({
        next: (res) => {
          alert('Cierre guardado exitosamente en la base de datos');
          this.cargarHistorial(); // Refrescamos la tabla de historial
        },
        error: (err) => alert('Error al guardar el reporte')
      });
    }
  }
}
