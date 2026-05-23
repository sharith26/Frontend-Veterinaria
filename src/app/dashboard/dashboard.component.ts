import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../services/mascota.service';
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

  mascotaForm = {
    nombre: '',
    especie: 'Canino',
    raza: '',
    edad: 0,
    dueno: '',
    activo: true
  };

  listaMascotas: any[] = [];

  listaRespaldo = [
    {
      id: 1,
      nombre: 'Max',
      especie: 'Canino',
      raza: 'Golden Retriever',
      edad: 3,
      dueno: 'Laura Rodríguez',
      activo: true
    },
    {
      id: 2,
      nombre: 'Luna',
      especie: 'Felino',
      raza: 'Siamés',
      edad: 2,
      dueno: 'Andrés Mora',
      activo: true
    },
    {
      id: 3,
      nombre: 'Toby',
      especie: 'Canino',
      raza: 'Pug',
      edad: 5,
      dueno: 'María Pérez',
      activo: false
    }
  ];

  constructor(
    private router: Router,
    private mascotaService: MascotaService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {

    this.rolUsuario =
      localStorage.getItem('rol') || 'Recepcionista';

    this.nombreUsuario =
      localStorage.getItem('usuario') || 'Admin Sistema';

    this.cargarMascotasReal();
  }

  async cargarMascotasReal() {

    const { data, error } = await this.supabaseService.supabase
      .from('mascota')
      .select(`
        id_mascota,
        nombre,
        fecha_nacimiento,
        activo,

        especie:id_especie (
          nombre_especie
        ),

        raza:id_raza (
          nombre_raza
        ),

        propietario:id_propietario (
          nombres,
          apellidos
        )
      `);

    if (error) {
      console.error(error);
      return;
    }

    this.listaMascotas = data.map((m: any) => {

      const edad =
        new Date().getFullYear() -
        new Date(m.fecha_nacimiento).getFullYear();

      return {

        id: m.id_mascota,

        nombre: m.nombre,

        especie: Array.isArray(m.especie)
          ? m.especie[0]?.nombre_especie
          : m.especie?.nombre_especie,

        raza: Array.isArray(m.raza)
          ? m.raza[0]?.nombre_raza
          : m.raza?.nombre_raza,

        edad: edad,

        dueno: Array.isArray(m.propietario)
          ? `${m.propietario[0]?.nombres} ${m.propietario[0]?.apellidos}`
          : `${m.propietario?.nombres} ${m.propietario?.apellidos}`,

        activo: m.activo
      };

    });

  }
listaMedicamentos: any[] = [];
medicamentoSeleccionado: any = null;
mostrarModalMedicamento: boolean = false;

// Método para abrir el modal
verDetalle(medicamento: any) {
  this.medicamentoSeleccionado = medicamento;
  this.mostrarModalMedicamento = true;
}

// Método para cerrar el modal
cerrarModalMedicamento() {
  this.mostrarModalMedicamento = false;
}

// Método para cargar los datos de la base
async cargarMedicamentos() {
  const { data, error } = await this.supabaseService.supabase
    .from('medicamento')
    .select('*');
  
  if (!error && data) {
    this.listaMedicamentos = data;
  }
}

  guardarMascota() {

    // SOLO SUPERADMIN Y ADMINISTRADOR
    if (
      this.rolUsuario !== 'Superadmin' &&
      this.rolUsuario !== 'Administrador'
    ) {

      alert(
        'No tienes permisos para guardar mascotas.'
      );

      return;
    }

    if (
      !this.mascotaForm.nombre.trim() ||
      !this.mascotaForm.dueno.trim()
    ) {

      alert(
        'Por favor, rellena los campos obligatorios.'
      );

      return;
    }

    if (
      this.editando &&
      this.idMascotaSeleccionada !== null
    ) {

      this.mascotaService
        .actualizarMascota(
          this.idMascotaSeleccionada,
          this.mascotaForm
        )
        .subscribe({

          next: () => {

            this.cargarMascotasReal();

            this.cerrarModal();
          },

          error: () => {

            this.listaMascotas[this.indexSeleccionado] = {
              ...this.mascotaForm,
              id: this.idMascotaSeleccionada
            };

            this.cerrarModal();
          }
        });

    } else {

      this.mascotaService
        .crearMascota(this.mascotaForm)
        .subscribe({

          next: () => {

            this.cargarMascotasReal();

            this.cerrarModal();
          },

          error: () => {

            const nuevaMascota = {
              ...this.mascotaForm,
              id: Date.now()
            };

            this.listaMascotas.unshift(nuevaMascota);

            this.cerrarModal();
          }
        });
    }
  }

  eliminarMascota(index: number) {

    if (
      this.rolUsuario !== 'Superadmin' &&
      this.rolUsuario !== 'Administrador'
    ) {

      alert(
        'No tienes permisos para eliminar mascotas.'
      );

      return;
    }

    const mascota = this.listaMascotas[index];

    const confirmar = confirm(
      `¿Estás seguro de deseas eliminar a ${mascota.nombre}?`
    );

    if (!confirmar) return;

    if (mascota.id) {

      this.mascotaService
        .eliminarMascota(mascota.id)
        .subscribe({

          next: () =>
            this.cargarMascotasReal(),

          error: () => {

            this.listaMascotas.splice(index, 1);
          }
        });

    } else {

      this.listaMascotas.splice(index, 1);
    }
  }

  abrirModalCrear() {

    if (
      this.rolUsuario !== 'Superadmin' &&
      this.rolUsuario !== 'Administrador'
    ) {

      alert(
        'No tienes permisos para crear mascotas.'
      );

      return;
    }

    this.editando = false;

    this.idMascotaSeleccionada = null;

    this.mascotaForm = {
      nombre: '',
      especie: 'Canino',
      raza: '',
      edad: 0,
      dueno: '',
      activo: true
    };

    this.mostrarModal = true;
  }

  abrirModalEditar(
    mascota: any,
    index: number
  ) {

    if (
      this.rolUsuario !== 'Superadmin' &&
      this.rolUsuario !== 'Administrador'
    ) {

      alert(
        'No tienes permisos para editar mascotas.'
      );

      return;
    }

    this.editando = true;

    this.indexSeleccionado = index;

    this.idMascotaSeleccionada =
      mascota.id || null;

    this.mascotaForm = { ...mascota };

    this.mostrarModal = true;
  }

  cerrarModal() {

    this.mostrarModal = false;
  }

  cerrarSesion() {

    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    localStorage.clear();

    this.router.navigate(['/login']);
  }

  esSuperAdmin(): boolean {

    return this.rolUsuario === 'Superadmin';
  }

  esAdministrador(): boolean {

    return this.rolUsuario === 'Administrador';
  }

  esUsuario(): boolean {

    return (
      this.rolUsuario === 'Veterinario' ||
      this.rolUsuario === 'Recepcionista'
    );
  }

  esConsultas(): boolean {

    return this.rolUsuario === 'Consultas';
  }

}