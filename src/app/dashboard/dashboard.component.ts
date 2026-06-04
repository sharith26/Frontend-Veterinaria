import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../services/mascota.service';
import { RolService } from '../services/rol.service';
import { SupabaseService } from '../services/supabase';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  rolUsuario: string | null = '';
  nombreUsuario: string | null = '';
  mostrarModal: boolean = false;
  editando: boolean = false;
  indexSeleccionado: number = -1;
  idMascotaSeleccionada: number | null = null;
  mostrarModalMedicamentos: boolean = false;
  mascotaSeleccionada: any = null;
  medicamentosMascota: any[] = [];
  cargandoMedicamentos: boolean = false;
  listaMascotas: any[] = [];
  listaEspecies: any[] = [];
  listaRazas: any[] = [];
  listaPropietariosSelect: any[] = [];
  historialMascota: any[] = [];
  mostrarModalHistorial: boolean = false;
  mascotaHistorial: any = null;
  cargandoHistorial: boolean = false;
  mascotaForm: any = {
    nombre: '',
    id_especie: null,
    id_raza: null,
    fecha_nacimiento: '',
    sexo: 'M',
    peso_actual: 0,
    color: '',
    esterilizado: false,
    id_propietario: null,
    activo: true
  };

  constructor(
    private router: Router,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef,
    public rolService: RolService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.rolUsuario = localStorage.getItem('rol');
    this.cargarMascotasReal();
    this.cargarSelectores();
  }

  cargarSelectores() {
    this.mascotaService.obtenerEspecies().subscribe((data: any[]) => this.listaEspecies = data);
    this.mascotaService.obtenerRazas().subscribe((data: any[]) => this.listaRazas = data);
    this.mascotaService.obtenerPropietariosLista().subscribe((data: any[]) => this.listaPropietariosSelect = data);
  }

  cargarMascotasReal() {
  this.mascotaService.obtenerMascotas().subscribe((data: any[]) => {
    this.listaMascotas = data
      .filter((m: any) => m.activo === true)  // ← solo activas
      .map((m: any) => ({
        ...m,
        id_mascota: m.id_mascota,
        nombre: m.nombre,
        fecha_nacimiento: m.fecha_nacimiento,
        sexo: m.sexo,
        peso_actual: m.peso_actual,
        color: m.color,
        esterilizado: m.esterilizado,
        activo: m.activo,
        id_especie: m.id_especie,
        id_raza: m.id_raza,
        id_propietario: m.id_propietario,
        especie: m.especie,
        raza: m.raza,
        propietario: m.propietario
      }));
    this.cdr.detectChanges();
  });
}

  // ✅ Calcula la edad en años desde la fecha de nacimiento
  calcularEdad(fechaNacimiento: string): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return edad;
  }

  verHistorial(mascota: any) {
  this.mascotaHistorial = mascota;
  this.mostrarModalHistorial = true;
  this.cargandoHistorial = true;

  this.mascotaService.obtenerHistorialPorMascota(mascota.id_mascota).subscribe({
    // En tu función verHistorial:
next: (data: any) => {
  console.log("Datos recibidos:", data);
  
  // Accedemos a la propiedad 'historias' del objeto que llega
  this.historialMascota = data.historias || []; 
  
  this.cargandoHistorial = false;
  this.cdr.detectChanges();
},
   
  });
}
  cerrarModalHistorial() {
    this.mostrarModalHistorial = false;
    this.historialMascota = [];
    this.mascotaHistorial = null;
  }

  verMedicamentosMascota(mascota: any) {
    this.mascotaSeleccionada = mascota;
    this.mostrarModalMedicamentos = true;
    this.cargandoMedicamentos = true;
    this.medicamentosMascota = [];

    this.mascotaService.obtenerMedicamentosPorMascota(mascota.id_mascota).subscribe({
      next: (data: any[]) => {
        this.medicamentosMascota = data;
        this.cargandoMedicamentos = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.medicamentosMascota = [];
        this.cargandoMedicamentos = false;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarModalMedicamentos() {
    this.mostrarModalMedicamentos = false;
    this.medicamentosMascota = [];
    this.mascotaSeleccionada = null;
  }

 guardarMascota() {
  if (!this.mascotaForm.nombre?.trim()) {
    alert('El nombre es obligatorio.');
    return;
  }
  if (!this.mascotaForm.id_propietario) {
    alert('Por favor selecciona un propietario.');
    return;
  }
  if (!this.mascotaForm.id_especie) {
    alert('Por favor selecciona una especie.');
    return;
  }
  if (this.editando && this.idMascotaSeleccionada) {
    this.mascotaService.actualizarMascota(this.idMascotaSeleccionada, this.mascotaForm).subscribe({
      next: () => { this.cargarMascotasReal(); this.cerrarModal(); },
      error: (err: any) => console.error('Error actualizando:', err)
    });
  } else {
    this.mascotaService.crearMascota(this.mascotaForm).subscribe({
      next: () => { this.cargarMascotasReal(); this.cerrarModal(); },
      error: (err: any) => console.error('Error creando:', err)
    });
  }
}

  eliminarMascota(mascota: any) {
    if (confirm(`¿Estás seguro de eliminar a ${mascota.nombre}?`)) {
      this.mascotaService.eliminarMascota(mascota.id_mascota).subscribe(() => {
        this.cargarMascotasReal();
      });
    }
  }

  abrirModalCrear() {
    this.editando = false;
    this.idMascotaSeleccionada = null;
    this.mascotaForm = {
      nombre: '',
      id_especie: null,
      id_raza: null,
      fecha_nacimiento: '',
      sexo: 'M',
      peso_actual: 0,
      color: '',
      esterilizado: false,
      id_propietario: null,
      activo: true
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(mascota: any, index: number) {
  if (!this.rolService.puede('editarMascota')) {
    alert('No tienes permisos para editar mascotas.');
    return;
  }
  this.editando = true;
  this.idMascotaSeleccionada = mascota.id_mascota;
  this.indexSeleccionado = index;
  this.mascotaForm = {
    nombre: mascota.nombre ?? '',
    id_especie: mascota.id_especie ? Number(mascota.id_especie) : null,
    id_raza: mascota.id_raza ? Number(mascota.id_raza) : null,
    fecha_nacimiento: mascota.fecha_nacimiento ?? '',
    sexo: mascota.sexo ?? 'M',
    peso_actual: mascota.peso_actual ?? 0,
    color: mascota.color ?? '',
    esterilizado: mascota.esterilizado ?? false,
    id_propietario: mascota.id_propietario ? Number(mascota.id_propietario) : null,
    activo: mascota.activo ?? true
  };
  this.mostrarModal = true;
}

  cerrarModal() {
    this.mostrarModal = false;
    this.editando = false;
    this.idMascotaSeleccionada = null;
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}