import { Component, Input, OnInit } from '@angular/core';
import { Puesto } from "../../../../models/puesto";
import { PuestoService } from "../../../puestos/puestos/puestos.service";
import { PagosService } from "../../../pagos/PagoService";
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-catalogo-puestos',
  templateUrl: './catalogo-puestos.component.html',
  styleUrls: ['./catalogo-puestos.component.css']
})
export class CatalogoPuestosComponent implements OnInit {

  @Input() socioActual: any;

  // Listas para control de datos
  puestosTodos: Puesto[] = [];      // Carga original del servidor
  puestosFiltrados: Puesto[] = [];  // Resultado del filtro por combo
  puestosDisponibles: Puesto[] = []; // Los 6 que se ven en la pantalla actual

  loading: boolean = false;

  // Variables de Galería
  puestoSeleccionado: any = null;
  fotosArray: string[] = [];

  // --- NUEVAS VARIABLES: PAGINACIÓN Y BUSQUEDA ---
  filtroCategoria: string = '';
  categorias: string[] = ['Abarrotes', 'Comida', 'Ropa', 'Calzado', 'Ferretería', 'Servicios', 'Otros'];

  currentPage: number = 0;
  pageSize: number = 6;
  totalPages: number = 0;

  constructor(
    private puestoService: PuestoService,
    private pagoService: PagosService
  ) { }

  ngOnInit(): void {
    this.cargarPuestos();
  }

  // --- LÓGICA DE CARGA Y FILTRADO ---

  cargarPuestos(): void {
    this.loading = true;
    this.puestoService.listarDisponiblesNormales().subscribe({
      next: (res) => {
        this.puestosTodos = res;
        this.aplicarFiltro(); // Primera ejecución
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error("Error al cargar puestos", err);
      }
    });
  }

  aplicarFiltro(): void {
    // 1. Filtrar la lista total por la categoría seleccionada
    if (this.filtroCategoria) {
      this.puestosFiltrados = this.puestosTodos.filter(p => p.categoria === this.filtroCategoria);
    } else {
      this.puestosFiltrados = [...this.puestosTodos];
    }

    // 2. Resetear a la primera página y calcular totales
    this.currentPage = 0;
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    this.totalPages = Math.ceil(this.puestosFiltrados.length / this.pageSize);

    // Evita que sea 0 (rompe la UI)
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }

    console.log('Total puestos:', this.puestosFiltrados.length);
    console.log('Total páginas:', this.totalPages);

    this.actualizarVistaPaginada();
  }

  actualizarVistaPaginada(): void {
    const inicio = this.currentPage * this.pageSize;
    const fin = inicio + this.pageSize;
    this.puestosDisponibles = this.puestosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPages) {
      this.currentPage = pagina;
      this.actualizarVistaPaginada();
      // Scroll suave arriba para que el usuario vea los nuevos resultados
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get arrayPaginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // --- MÉTODOS DE SOPORTE (GALERÍA Y ADMIN) ---

  esAdmin(): boolean {
    return this.socioActual?.role === 'ADMIN' || this.socioActual?.role === 'ROLE_ADMIN';
  }

  verDetalle(p: any): void {
    this.puestoSeleccionado = { ...p };
    if (p.fotosGaleria) {
      this.fotosArray = p.fotosGaleria.split(',').map((url: string) => url.trim());
    } else {
      this.fotosArray = [];
    }

    const modalElement = document.getElementById('detalleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cambiarFotoPrincipal(url: string): void {
    this.puestoSeleccionado.imagenUrl = url;
  }

  confirmarAlquiler(puesto: Puesto): void {
    this.alquilar(puesto);
  }

  // --- LÓGICA DE NEGOCIO (PAGOS) ---

  alquilar(puesto: Puesto): void {
    if (!this.socioActual || !this.socioActual.id) {
      Swal.fire('Atención', 'Debes iniciar sesión para realizar esta acción.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmar Alquiler',
      html: `
        <div class="text-start">
          <p><b>Puesto:</b> ${puesto.codigo}</p>
          <p><b>Categoría:</b> ${puesto.categoria}</p>
          <p><b>Precio Mensual:</b> S/ ${puesto.precioAlquiler.toFixed(2)}</p>
          <hr>
          <p class="small text-muted">* Serás redirigido a Stripe para completar el pago.</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ir a Pagar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const modalElement = document.getElementById('detalleModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if(modal) modal.hide();

        this.procesarPago(puesto);
      }
    });
  }

  procesarPago(puesto: Puesto): void {
    const request = {
      socioId: this.socioActual.id,
      puestoId: puesto.id!,
      monto: puesto.precioAlquiler,
      concepto: `Alquiler Mensual - Puesto ${puesto.codigo}`
    };

    Swal.fire({
      title: 'Conectando con Stripe...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    this.pagoService.crearCheckout(request).subscribe({
      next: (res: any) => {
        if (res) {
          const url = typeof res === 'string' ? res : res.urlPago;
          window.location.href = url;
        }
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo generar el enlace de pago.', 'error');
        console.error(err);
      }
    });
  }
}
