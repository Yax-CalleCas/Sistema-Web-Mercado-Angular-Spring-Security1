import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PuestoService } from './puestos.service';
import { Puesto } from '../../../models/puesto';
import { PuestoRequest } from '../../../models/puesto-request';
import { Socio } from '../../socios/socios.model';
import { SocioService } from '../../socios/socios.service';
import Swal from 'sweetalert2';

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

  initForm(): void {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(3)]],
      ubicacion: ['', Validators.required],
      categoria: ['', Validators.required], // Campo nuevo agregado
      socioId: [null],
      esAsociacion: [false],
      imagenUrl: [''],
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

    const data: PuestoRequest = this.form.value;

    const request = this.editMode && this.idEdit !== null
      ? this.puestoService.actualizar(this.idEdit, data)
      : this.puestoService.crear(data);

    request.subscribe({
      next: () => {
        const mensaje = this.editMode ? 'Puesto actualizado correctamente' : 'Puesto registrado con éxito';
        this.showToast('success', mensaje);
        this.reset();
        this.listar();
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.showToast('error', 'Error al procesar la solicitud');
      }
    });
  }

  editar(p: Puesto): void {
    this.editMode = true;
    this.idEdit = p.id ?? null;

    this.form.patchValue({
      codigo: p.codigo,
      ubicacion: p.ubicacion,
      categoria: p.categoria, // Mapeo de categoria al editar
      socioId: p.socio?.id ?? null,
      esAsociacion: p.esAsociacion ?? false,
      imagenUrl: p.imagenUrl ?? '',
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
      text: '¿Estás seguro de que deseas eliminar este puesto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.puestoService.eliminar(id).subscribe({
          next: () => {
            this.showToast('success', 'Puesto eliminado');
            this.listar();
          },
          error: (err) => {
            this.showToast('error', 'No se pudo eliminar el puesto');
          }
        });
      }
    });
  }

  reset(): void {
    this.form.reset({
      esAsociacion: false,
      socioId: null,
      precioAlquiler: 0,
      serviciosIncluidos: false,
      costoAguaFijo: 0,
      costoLuzFijo: 0,
      categoria: '' // Reseteo de categoria
    });
    this.editMode = false;
    this.idEdit = null;
  }

  private showToast(icon: 'success' | 'error', title: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
    Toast.fire({ icon, title });
  }
}
