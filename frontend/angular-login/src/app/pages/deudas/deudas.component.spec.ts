import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deudas',
  templateUrl: './deudas.component.html',
  styleUrls: ['./deudas.component.css']
})
export class DeudasComponent implements OnInit {
  deudasPendientes: any[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDeudas();
  }

  cargarDeudas() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/admin/deudas/pendientes').subscribe({
      next: (data) => {
        this.deudasPendientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error cargando deudas", err);
        this.loading = false;
      }
    });
  }

  notificarSocio(deuda: any) {
    Swal.fire({
      title: 'Notificar Socio',
      text: `Se enviara un recordatorio de pago a ${deuda.puesto.socio.nombres} por el mes de ${deuda.mesReferencia}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Enviar Notificacion'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Enviado', 'El socio ha sido notificado correctamente', 'success');
      }
    });
  }
}
