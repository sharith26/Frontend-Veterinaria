import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitaService } from '../../services/cita.service';
import { MascotaService } from '../../services/mascota.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {

  listaCitas: any[] = [];
  listaMascotas: any[] = [];
  listaVeterinarios: any[] = [];
  loading: boolean = true;
  mostrarModal: boolean = false;
  editando: boolean = false;
  idSeleccionado: number | null = null;

  citaForm = {
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'confirmada',
    id_mascota: null as number | null,
    id_veterinario: null as number | null,
    id_usuario_agenda: null as number | null
  };

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarCitas();
    this.cargarSelectores();
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token));
      this.citaForm.id_usuario_agenda = payload.id;
    }
  }

  cargarCitas() {
    this.loading = true;
    this.citaService.obtenerCitas().subscribe({
      next: (data: any[]) => {
        this.listaCitas = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando citas:', err);
        this.loading = false;
      }
    });
  }

  cargarSelectores() {
    this.mascotaService.obtenerMascotas().subscribe({
      next: (data) => this.listaMascotas = data,
      error: (err: any) => console.error('Error cargando mascotas:', err)
    });
    this.mascotaService.obtenerVeterinarios().subscribe({
      next: (data) => this.listaVeterinarios = data,
      error: (err: any) => console.error('Error cargando veterinarios:', err)
    });
  }

  abrirModalCrear() {
    if (!this.rolService.puede('crearCita')) {
      alert('No tienes permisos para crear citas.');
      return;
    }
    this.editando = false;
    this.idSeleccionado = null;
    const token = localStorage.getItem('token');
    const idUsuario = token ? JSON.parse(atob(token)).id : null;
    this.citaForm = {
      fecha: '',
      hora: '',
      motivo: '',
      estado: 'confirmada',
      id_mascota: null,
      id_veterinario: null,
      id_usuario_agenda: idUsuario
    };
    this.mostrarModal = true;
  }

  abrirModalEditar(cita: any) {
    if (!this.rolService.puede('editarCita')) {
      alert('No tienes permisos para editar citas.');
      return;
    }
    this.editando = true;
    this.idSeleccionado = cita.id_cita;
    this.citaForm = {
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
      estado: cita.estado,
      id_mascota: cita.mascota?.id_mascota || null,
      id_veterinario: cita.veterinario?.id_veterinario || null,
      id_usuario_agenda: cita.id_usuario_agenda || null
    };
    this.mostrarModal = true;
  }

  guardarCita() {
    if (!this.citaForm.fecha || !this.citaForm.hora || !this.citaForm.motivo || !this.citaForm.id_mascota || !this.citaForm.id_veterinario) {
      alert('Por favor rellena todos los campos obligatorios.');
      return;
    }
    if (this.editando && this.idSeleccionado !== null) {
      this.citaService.actualizarCita(this.idSeleccionado, this.citaForm).subscribe({
        next: () => { this.cargarCitas(); this.cerrarModal(); },
        error: (err: any) => console.error('Error actualizando cita:', err)
      });
    } else {
      this.citaService.crearCita(this.citaForm).subscribe({
        next: () => { this.cargarCitas(); this.cerrarModal(); },
        error: (err: any) => console.error('Error creando cita:', err)
      });
    }
  }

  eliminarCita(id: number) {
    if (!this.rolService.puede('eliminarCita')) {
      alert('No tienes permisos para eliminar citas.');
      return;
    }
    const confirmar = confirm('¿Estás seguro de eliminar esta cita?');
    if (!confirmar) return;
    this.citaService.eliminarCita(id).subscribe({
      next: () => this.cargarCitas(),
      error: (err: any) => console.error('Error eliminando cita:', err)
    });
  }

  getBadgeClass(estado: string): string {
    switch (estado) {
      case 'confirmada': return 'bg-primary';
      case 'atendida': return 'bg-success';
      case 'cancelada': return 'bg-danger';
      case 'pendiente': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }

  cerrarModal() { this.mostrarModal = false; }
  volver() { this.router.navigate(['/dashboard']); }
}