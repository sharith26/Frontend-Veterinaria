import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../services/mascota.service';
import { RolService } from '../services/rol.service';

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

  mascotaForm = {
    nombre: '',
    especie: 'Canino',
    raza: '',
    edad: 0,
    dueno: '',
    activo: true
  };

  constructor(
    private router: Router,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef,
    public rolService: RolService
  ) {}

  ngOnInit(): void {
    this.rolUsuario = localStorage.getItem('rol') || 'Recepcionista';
    this.nombreUsuario = localStorage.getItem('usuario') || 'Admin Sistema';
    this.cargarMascotasReal();
  }

  cargarMascotasReal() {
    this.mascotaService.obtenerMascotas().subscribe({
      next: (data: any[]) => {
        this.listaMascotas = data.map((m: any) => {
          const edad = m.fecha_nacimiento
            ? new Date().getFullYear() - new Date(m.fecha_nacimiento).getFullYear()
            : 0;
          return {
            id: m.id_mascota,
            nombre: m.nombre,
            especie: Array.isArray(m.especie) ? m.especie[0]?.nombre_especie : m.especie?.nombre_especie,
            raza: Array.isArray(m.raza) ? m.raza[0]?.nombre_raza : m.raza?.nombre_raza,
            edad: edad,
            dueno: Array.isArray(m.propietario)
              ? `${m.propietario[0]?.nombres} ${m.propietario[0]?.apellidos}`
              : `${m.propietario?.nombres} ${m.propietario?.apellidos}`,
            activo: m.activo
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando mascotas:', err)
    });
  }

  // ← Nuevo método para navegar al historial
  verHistorial(mascota: any) {
    this.router.navigate(['/historial', mascota.id]);
  }

  verMedicamentosMascota(mascota: any) {
    this.mascotaSeleccionada = mascota;
    this.medicamentosMascota = [];
    this.cargandoMedicamentos = true;
    this.mostrarModalMedicamentos = true;

    this.mascotaService.obtenerMedicamentosPorMascota(mascota.id).subscribe({
      next: (data: any[]) => {
        this.medicamentosMascota = data || [];
        this.cargandoMedicamentos = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar medicamentos:', err);
        this.cargandoMedicamentos = false;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarModalMedicamentos() {
    this.mostrarModalMedicamentos = false;
    this.mascotaSeleccionada = null;
    this.medicamentosMascota = [];
  }

  guardarMascota() {
    if (!this.rolService.puede('crearMascota') && !this.rolService.puede('editarMascota')) {
      alert('No tienes permisos para guardar mascotas.');
      return;
    }
    if (!this.mascotaForm.nombre.trim() || !this.mascotaForm.dueno.trim()) {
      alert('Por favor, rellena los campos obligatorios.');
      return;
    }
    if (this.editando && this.idMascotaSeleccionada !== null) {
      this.mascotaService.actualizarMascota(this.idMascotaSeleccionada, this.mascotaForm).subscribe({
        next: () => { this.cargarMascotasReal(); this.cerrarModal(); },
        error: () => { this.listaMascotas[this.indexSeleccionado] = { ...this.mascotaForm, id: this.idMascotaSeleccionada }; this.cerrarModal(); }
      });
    } else {
      this.mascotaService.crearMascota(this.mascotaForm).subscribe({
        next: () => { this.cargarMascotasReal(); this.cerrarModal(); },
        error: () => { this.listaMascotas.unshift({ ...this.mascotaForm, id: Date.now() }); this.cerrarModal(); }
      });
    }
  }

  eliminarMascota(index: number) {
    if (!this.rolService.puede('eliminarMascota')) {
      alert('No tienes permisos para eliminar mascotas.');
      return;
    }
    const mascota = this.listaMascotas[index];
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar a ${mascota.nombre}?`);
    if (!confirmar) return;
    if (mascota.id) {
      this.mascotaService.eliminarMascota(mascota.id).subscribe({
        next: () => this.cargarMascotasReal(),
        error: () => this.listaMascotas.splice(index, 1)
      });
    } else {
      this.listaMascotas.splice(index, 1);
    }
  }

  abrirModalCrear() {
    if (!this.rolService.puede('crearMascota')) {
      alert('No tienes permisos para crear mascotas.');
      return;
    }
    this.editando = false;
    this.idMascotaSeleccionada = null;
    this.mascotaForm = { nombre: '', especie: 'Canino', raza: '', edad: 0, dueno: '', activo: true };
    this.mostrarModal = true;
  }

  abrirModalEditar(mascota: any, index: number) {
    if (!this.rolService.puede('editarMascota')) {
      alert('No tienes permisos para editar mascotas.');
      return;
    }
    this.editando = true;
    this.indexSeleccionado = index;
    this.idMascotaSeleccionada = mascota.id || null;
    this.mascotaForm = { ...mascota };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }
  cerrarSesion() { localStorage.clear(); this.router.navigate(['/login']); }
  esSuperAdmin(): boolean { return this.rolUsuario === 'Superadmin'; }
  esAdministrador(): boolean { return this.rolUsuario === 'Administrador'; }
  esUsuario(): boolean { return this.rolUsuario === 'Veterinario' || this.rolUsuario === 'Recepcionista'; }
  esConsultas(): boolean { return this.rolUsuario === 'Consultas'; }
}