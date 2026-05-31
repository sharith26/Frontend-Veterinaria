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

  // ✅ Propiedades historial
  historialMascota: any[] = [];
  mostrarModalHistorial: boolean = false;
  mascotaHistorial: any = null;
  cargandoHistorial: boolean = false;

  mascotaForm = {
    nombre: '',
    id_especie: null as number | null,
    id_raza: null as number | null,
    fecha_nacimiento: '',
    sexo: 'M',
    peso_actual: 0,
    color: '',
    esterilizado: false,
    id_propietario: null as number | null,
    activo: true
  };

  constructor(
    private router: Router,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef,
    public rolService: RolService,
    private supabaseService: SupabaseService  // ✅ Añadido
  ) {}

  ngOnInit(): void {
    this.rolUsuario = localStorage.getItem('rol') || 'Recepcionista';
    this.nombreUsuario = localStorage.getItem('usuario') || 'Admin Sistema';
    this.cargarMascotasReal();
    this.cargarSelectores();
  }

  cargarSelectores() {
    this.mascotaService.obtenerEspecies().subscribe({
      next: (data) => this.listaEspecies = data,
      error: (err: any) => console.error('Error cargando especies:', err)
    });
    this.mascotaService.obtenerRazas().subscribe({
      next: (data) => this.listaRazas = data,
      error: (err: any) => console.error('Error cargando razas:', err)
    });
    this.mascotaService.obtenerPropietariosLista().subscribe({
      next: (data) => this.listaPropietariosSelect = data,
      error: (err: any) => console.error('Error cargando propietarios:', err)
    });
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
            id_mascota: m.id_mascota,  // ✅ Necesario para el filtro de historial
            nombre: m.nombre,
            especie: Array.isArray(m.especie) ? m.especie[0]?.nombre_especie : m.especie?.nombre_especie,
            raza: Array.isArray(m.raza) ? m.raza[0]?.nombre_raza : m.raza?.nombre_raza,
            edad: edad,
            dueno: Array.isArray(m.propietario)
              ? `${m.propietario[0]?.nombres} ${m.propietario[0]?.apellidos}`
              : `${m.propietario?.nombres} ${m.propietario?.apellidos}`,
            activo: m.activo,
            id_especie: m.id_especie,
            id_raza: m.id_raza,
            id_propietario: m.id_propietario,
            fecha_nacimiento: m.fecha_nacimiento,
            sexo: m.sexo,
            peso_actual: m.peso_actual,
            color: m.color,
            esterilizado: m.esterilizado
          };
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando mascotas:', err)
    });
  }

  async verHistorial(mascota: any) {
    console.log('🐾 Mascota seleccionada:', mascota);
    console.log('🔑 id_mascota:', mascota.id_mascota, '| id:', mascota.id);

    this.mascotaHistorial = mascota;
    this.mostrarModalHistorial = true;
    this.cargandoHistorial = true;
    this.historialMascota = [];

    const { data, error } = await this.supabaseService.supabase
      .from('historia_clinica')
      .select(`
        id_historia,
        fecha_consulta,
        peso_kg,
        temperatura_c,
        frec_cardiaca,
        frec_respiratoria,
        sintomas,
        diagnostico,
        tratamiento,
        observaciones,
        cita:id_cita (
          id_cita,
          id_mascota
        )
      `)
      .order('fecha_consulta', { ascending: false });

    console.log('📋 Data historial:', data);
    console.log('🔍 Primer registro cita:', data?.[0]?.cita);

    if (!error && data) {
      this.historialMascota = data.filter(
        (h: any) => h.cita?.id_mascota === mascota.id_mascota
      );
      console.log('✅ Filtrado:', this.historialMascota.length, 'registros');
    } else {
      console.error('❌ Error historial:', error);
    }

    this.cargandoHistorial = false;
    this.cdr.detectChanges();
  }

  cerrarModalHistorial() {
    this.mostrarModalHistorial = false;
    this.mascotaHistorial = null;
    this.historialMascota = [];
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
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
    if (!this.mascotaForm.nombre.trim() || !this.mascotaForm.id_propietario || !this.mascotaForm.id_especie) {
      alert('Por favor rellena los campos obligatorios: nombre, especie y propietario.');
      return;
    }
    if (this.editando && this.idMascotaSeleccionada !== null) {
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
        error: (err: any) => this.listaMascotas.splice(index, 1)
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
    this.indexSeleccionado = index;
    this.idMascotaSeleccionada = mascota.id || null;
    this.mascotaForm = {
      nombre: mascota.nombre,
      id_especie: mascota.id_especie || null,
      id_raza: mascota.id_raza || null,
      fecha_nacimiento: mascota.fecha_nacimiento || '',
      sexo: mascota.sexo || 'M',
      peso_actual: mascota.peso_actual || 0,
      color: mascota.color || '',
      esterilizado: mascota.esterilizado || false,
      id_propietario: mascota.id_propietario || null,
      activo: mascota.activo
    };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; }
  cerrarSesion() { localStorage.clear(); this.router.navigate(['/login']); }
  esSuperAdmin(): boolean { return this.rolUsuario === 'Superadmin'; }
  esAdministrador(): boolean { return this.rolUsuario === 'Administrador'; }
  esUsuario(): boolean { return this.rolUsuario === 'Veterinario' || this.rolUsuario === 'Recepcionista'; }
  esConsultas(): boolean { return this.rolUsuario === 'Consultas'; }
}