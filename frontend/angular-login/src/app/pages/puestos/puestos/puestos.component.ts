import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PuestoService } from './puestos.service';
import { Puesto } from '../../../models/puesto';
import { PuestoRequest } from '../../../models/puesto-request';
import { Socio } from '../../socios/socios.model';
import { SocioService } from '../../socios/socios.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})
export class PuestosComponent implements OnInit {

  form!: FormGroup;
  puestos: Puesto[] = [];
  socios: Socio[] = [];

  editMode = false;
  idEdit: number | null = null;

  // --- LÓGICA DE DETALLE Y GALERÍA 2025 ---
  puestoSeleccionado: any = null;
  fotosArray: string[] = [];
  fotoPrincipalTemporal: string | null = null; // Para no perder la original al jugar con la galería

  // Paginación
  currentPage = 0;
  pageSize = 6;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = false;

  constructor(
    private fb: FormBuilder,
    private puestoService: PuestoService,
    private socioService: SocioService
  ) {}

  get paginas(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  ngOnInit(): void {
    this.initForm();
    this.listar();
    this.cargarSocios();
  }

  // --- MÉTODOS DE GALERÍA ---

  verDetalle(p: any): void {
    this.puestoSeleccionado = { ...p }; // Clonamos para no afectar la lista original al cambiar fotos
    this.fotoPrincipalTemporal = p.imagenUrl; // Guardamos la portada real

    // Convertimos el string de la galería en un arreglo real
    if (p.fotosGaleria) {
      // Separamos por comas y limpiamos espacios en blanco
      this.fotosArray = p.fotosGaleria.split(',').map((url: string) => url.trim());
    } else {
      this.fotosArray = [];
    }

    // Abrimos el modal con la API de Bootstrap 5
    const modalElement = document.getElementById('detalleModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  /**
   * Cambia la imagen que se ve en grande en el modal (Efecto 2025)
   */
  cambiarFotoPrincipal(url: string): void {
    this.puestoSeleccionado.imagenUrl = url;
  }

  // --- GESTIÓN DE FORMULARIO ---

  initForm(): void {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      ubicacion: ['', Validators.required],
      categoria: ['', Validators.required],
      estado: ['DISPONIBLE', Validators.required],
      activo: [true],
      socioId: [null],
      esAsociacion: [false],
      imagenUrl: [''],
      descripcion: [''],      // Campo para descripción larga
      fotosGaleria: [''],     // Campo para URLs separadas por comas
      precioAlquiler: [0, [Validators.required, Validators.min(0)]],
      serviciosIncluidos: [false],
      costoAguaFijo: [0, [Validators.min(0)]],
      costoLuzFijo: [0, [Validators.min(0)]]
    });
  }

  listar(): void {
    this.puestoService.listarPaginado(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        this.puestos = res.content || [];
        this.totalPages = res.totalPages || 0;
        this.totalElements = res.totalElements || 0;
        this.isFirst = res.first;
        this.isLast = res.last;
      },
      error: (err) => {
        console.error('Error al cargar puestos:', err);
        this.showToast('error', 'Error al cargar los puestos del mercado');
      }
    });
  }

  cambiarPagina(p: number): void {
    if (p >= 0 && p < this.totalPages) {
      this.currentPage = p;
      this.listar();
    }
  }

  cargarSocios(): void {
    this.socioService.listar().subscribe({
      next: (data) => this.socios = data || [],
      error: (err) => console.error('Error al cargar socios:', err)
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showToast('error', 'Por favor complete los campos requeridos');
      return;
    }

    const data: PuestoRequest = {
      ...this.form.value,
      socioId: this.form.value.socioId === 'null' ? null : this.form.value.socioId
    };

    const request = this.editMode && this.idEdit !== null
      ? this.puestoService.actualizar(this.idEdit, data)
      : this.puestoService.crear(data);

    request.subscribe({
      next: () => {
        const mensaje = this.editMode ? 'Puesto actualizado' : 'Puesto registrado';
        this.showToast('success', mensaje);
        this.reset();
        this.listar();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.showToast('error', 'Error en la solicitud. Revise el código.');
      }
    });
  }
  editar(p: Puesto): void {
    this.editMode = true;
    this.idEdit = p.id ?? null;

    this.form.patchValue({
      codigo: p.codigo,
      ubicacion: p.ubicacion,
      categoria: p.categoria,
      estado: p.estado || 'DISPONIBLE',
      activo: p.activo ?? true,
      socioId: p.socio?.id ?? null,
      esAsociacion: p.esAsociacion ?? false,
      imagenUrl: p.imagenUrl ?? '',
      // --- CORRECCIÓN AQUÍ ---
      descripcion: p.descripcion || '',   // Si es null, enviamos string vacío
      fotosGaleria: p.fotosGaleria || '', // Si es null, enviamos string vacío
      // -----------------------
      precioAlquiler: p.precioAlquiler ?? 0,
      serviciosIncluidos: p.serviciosIncluidos ?? false,
      costoAguaFijo: p.costoAguaFijo ?? 0,
      costoLuzFijo: p.costoLuzFijo ?? 0
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar Puesto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.puestoService.eliminar(id).subscribe({
          next: () => {
            this.showToast('success', 'Eliminado correctamente');
            this.listar();
          },
          error: () => this.showToast('error', 'Error al eliminar')
        });
      }
    });
  }

  reset(): void {
    this.form.reset({
      estado: 'DISPONIBLE',
      activo: true,
      esAsociacion: false,
      socioId: null,
      precioAlquiler: 0,
      serviciosIncluidos: false,
      costoAguaFijo: 0,
      costoLuzFijo: 0,
      categoria: '',
      descripcion: '',      // Corregido: de [''] a ''
      fotosGaleria: ''      // Corregido: de [''] a ''
    });
    this.editMode = false;
    this.idEdit = null;
  }

  private showToast(icon: 'success' | 'error', title: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
    Toast.fire({ icon, title });
  }
}
