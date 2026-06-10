import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FacturaService } from '../../services/factura.service';
import { PropietarioService } from '../../services/propietario.service';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './factura.component.html'
})
export class FacturaComponent implements OnInit {
  facturaForm: FormGroup;
  listaPropietarios: any[] = [];
  listaMascotas: any[] = [];
  listaCitas: any[] = [];
  ivaPorcentaje = 0.19;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private propietarioService: PropietarioService,
    private mascotaService: MascotaService
  ) {
    this.facturaForm = this.fb.group({
      numero_factura: ['', Validators.required],
      emisor_nit: ['900.123.456-7', Validators.required],
      emisor_direccion: ['Carrera 15 # 93-60, Bogotá', Validators.required],
      id_propietario: ['', Validators.required],
      id_mascota: ['', Validators.required],
      id_cita: [''],
      fecha_emision: [new Date().toISOString().split('T')[0], Validators.required],
      fecha_vencimiento: ['', Validators.required],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarPropietarios();
  }

  cargarPropietarios(): void {
    this.propietarioService.obtenerPropietarios().subscribe({
      next: (data: any[]) => this.listaPropietarios = data,
      error: (err: any) => console.error('Error cargando propietarios:', err)
    });
  }

  onPropietarioChange(event: any): void {
    const idPropietario = event.target.value;
    this.listaMascotas = [];
    this.listaCitas = [];
    this.facturaForm.patchValue({ id_mascota: '', id_cita: '' });
    if (idPropietario) {
      this.mascotaService.obtenerPorPropietario(idPropietario).subscribe({
        next: (data: any[]) => this.listaMascotas = data
      });
    }
  }

  onMascotaChange(event: any): void {
  const idMascota = event.target.value;
  this.listaCitas = [];
  this.facturaForm.patchValue({ id_cita: '' });

  if (idMascota) {
    this.facturaService.obtenerCitasPorMascota(idMascota).subscribe({
      next: (todasLasCitas: any[]) => {
        this.facturaService.obtenerCitasFacturadas().subscribe(citasYaFacturadas => {
          
          const idsFacturados = citasYaFacturadas.map(f => f.id_cita);
          this.listaCitas = todasLasCitas.filter(cita => !idsFacturados.includes(cita.id));
          
          if (this.listaCitas.length === 0) {
            alert('Esta mascota no tiene citas pendientes de facturar.');
          }
        });
      }
    });
  }
}

  get detalles(): FormArray {
    return this.facturaForm.get('detalles') as FormArray;
  }

  agregarFila() {
    this.detalles.push(this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  calcularSubtotal(): number {
    return this.detalles.controls.reduce((acc, row) =>
      acc + (row.value.cantidad * row.value.precio_unitario), 0);
  }

  guardar() {
  if (this.facturaForm.valid) {
    const subtotal = this.calcularSubtotal();
    const idUsuario = localStorage.getItem('id_usuario') || localStorage.getItem('id') || localStorage.getItem('userId');

    let citaSeleccionada = this.facturaForm.value.id_cita;
    if (citaSeleccionada === "") {
        citaSeleccionada = null;
    }

    const facturaData = {
      ...this.facturaForm.value,
      id_cita: citaSeleccionada, 
      fecha: this.facturaForm.value.fecha_emision,
      estado: 'pendiente',
      subtotal: subtotal,
      iva: subtotal * this.ivaPorcentaje,
      total: subtotal * (1 + this.ivaPorcentaje),
      id_usuario: Number(idUsuario)
    };

    this.facturaService.crearFacturaConDetalles(facturaData).subscribe({
      next: () => {
        alert('¡Factura guardada correctamente!');
        this.facturaForm.reset({
          emisor_nit: '900.123.456-7',
          emisor_direccion: 'Carrera 15 # 93-60, Bogotá',
          fecha_emision: new Date().toISOString().split('T')[0]
        });
        this.detalles.clear();
        this.listaMascotas = [];
        this.listaCitas = [];
      },
      error: (err: any) => {
        // Validación mejorada para el error de duplicidad
        if (err.status === 400 && err.error?.message?.includes('uq_factura_cita')) {
          alert('Esta cita ya ha sido facturada anteriormente. Por favor, seleccione otra.');
        } else {
          alert('Error al guardar: ' + (err.error?.message || 'Ocurrió un error inesperado'));
        }
      }
    });
  } else {
    alert('Por favor, completa todos los campos requeridos.');
  }
}
}