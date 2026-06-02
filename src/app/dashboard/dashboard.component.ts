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
  mascotaForm: any = { nombre: '', id_especie: null, id_raza: null, fecha_nacimiento: '', sexo: 'M', peso_actual: 0, color: '', esterilizado: false, id_propietario: null, activo: true };

  constructor(private router: Router, private mascotaService: MascotaService, private cdr: ChangeDetectorRef, public rolService: RolService, private supabaseService: SupabaseService) {}

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
    this.mascotaService.obtenerMascotas().subscribe((data: any[]) => { this.listaMascotas = data; this.cdr.detectChanges(); });
  }

  verHistorial(mascota: any) { this.mascotaHistorial = mascota; this.mostrarModalHistorial = true; }
  
  cerrarModalHistorial() { this.mostrarModalHistorial = false; }

  verMedicamentosMascota(mascota: any) { this.mascotaSeleccionada = mascota; this.mostrarModalMedicamentos = true; }

  cerrarModalMedicamentos() { this.mostrarModalMedicamentos = false; }

  guardarMascota() {
    if (this.editando && this.idMascotaSeleccionada) {
      this.mascotaService.actualizarMascota(this.idMascotaSeleccionada, this.mascotaForm).subscribe(() => this.cargarMascotasReal());
    } else {
      this.mascotaService.crearMascota(this.mascotaForm).subscribe(() => this.cargarMascotasReal());
    }
    this.mostrarModal = false;
  }

  eliminarMascota(index: number) { this.listaMascotas.splice(index, 1); }

  abrirModalCrear() { this.mostrarModal = true; }

  abrirModalEditar(mascota: any, index: number) { this.editando = true; this.mascotaForm = { ...mascota }; this.mostrarModal = true; }

  cerrarModal() { this.mostrarModal = false; }

  cerrarSesion() { localStorage.clear(); this.router.navigate(['/login']); }

  formatearFecha(fecha: string): string { return new Date(fecha).toLocaleDateString(); }
}