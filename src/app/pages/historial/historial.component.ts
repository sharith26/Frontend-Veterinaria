import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
  
  
})
export class HistorialComponent implements OnInit {

  listaHistorias: any[] = [];
  listaMedicamentos: any[] = [];
  listaPrescripciones: any[] = [];
  
  listaMascotas: any[] = [];
  mascotaSeleccionadaVer: any = null;
  historiasTodas: any[] = [];

  mascotaSeleccionada: any = null;
  medicamentosDeMascota: any[] = [];
  mostrarModalMedicamento: boolean = false;

  loading: boolean = false;
  errorMensaje: string = '';

  constructor(
    private supabaseService: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerEdad(fechaNacimiento: string): string {
    if (!fechaNacimiento) return 'Sin edad';
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad > 0 ? `${edad} año${edad !== 1 ? 's' : ''}` : 'Menos de 1 año';
  }

  seleccionarMascota(mascota: any) {
    this.mascotaSeleccionadaVer = mascota;
    this.filtrarHistorias();
  }

  filtrarHistorias() {
    if (!this.mascotaSeleccionadaVer || !this.historiasTodas.length) {
      this.listaHistorias = [];
      return;
    }

    const idBuscado = this.mascotaSeleccionadaVer.id_mascota;
    
    this.listaHistorias = this.historiasTodas.filter((h: any) => h.id_mascota === idBuscado);
    
    this.cdr.detectChanges();
  }

  async cargarDatos() {
    this.loading = true;
    this.errorMensaje = '';

    try {
      await this.cargarHistorias();
      await this.cargarMedicamentos();
      await this.cargarPrescripciones();
    } catch (error: any) {
      console.error('ERROR GENERAL:', error);
      this.errorMensaje = error?.message || 'Error al obtener los datos';
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  verMedicamentosPorMascota(historia: any) {
    this.mascotaSeleccionada = historia.mascota;
    this.medicamentosDeMascota = this.listaPrescripciones.filter((prescripcion: any) => {
      return prescripcion.historia_clinica?.mascota?.nombre === historia.mascota?.nombre;
    });
    this.mostrarModalMedicamento = true;
  }

  cerrarModalMedicamento() {
    this.mostrarModalMedicamento = false;
    this.mascotaSeleccionada = null;
    this.medicamentosDeMascota = [];
  }

  async cargarMedicamentos() {
    const { data, error } = await this.supabaseService.supabase
      .from('medicamento')
      .select('*');

    if (error) {
      console.error('Error medicamentos:', error);
      throw error;
    }

    this.listaMedicamentos = data || [];
  }

  async cargarHistorias() {
    try {
      const { data: historias } = await this.supabaseService.supabase
        .from('historia_clinica')
        .select('*');

      if (!historias || historias.length === 0) {
        this.listaHistorias = [];
        this.historiasTodas = [];
        return;
      }
      
      console.log('1. Historias:', historias.length);

      const { data: citas } = await this.supabaseService.supabase
        .from('cita')
        .select('*');
      const citasData: any[] = citas || [];
      console.log('2. Citas:', citasData.length);

      const { data: mascotas } = await this.supabaseService.supabase
        .from('mascota')
        .select('*');
      const mascotasData: any[] = mascotas || [];
      console.log('3. Mascotas:', mascotasData.length);

      const { data: propietarios } = await this.supabaseService.supabase
        .from('propietario')
        .select('*');
      const propietariosData: any[] = propietarios || [];

      const { data: especies } = await this.supabaseService.supabase
        .from('especie')
        .select('*');
      const especiesData: any[] = especies || [];

      const { data: raise } = await this.supabaseService.supabase
        .from('raza')
        .select('*');
      const raiseData: any[] = raise || [];

      this.listaMascotas = [...new Set(mascotasData.map((m: any) => m.id_mascota))]
        .map((id: any) => mascotasData.find((m: any) => m.id_mascota === id))
        .filter(Boolean);

      console.log('4. Mascotas únicas:', this.listaMascotas.length);

      if (this.listaMascotas.length > 0 && !this.mascotaSeleccionadaVer) {
        this.mascotaSeleccionadaVer = this.listaMascotas[0];
        console.log('5. Mascota seleccionada:', this.mascotaSeleccionadaVer.nombre);
      }

      this.historiasTodas = historias.map((historia: any) => {
        const cita = citasData.find((c: any) => c.id_cita === historia.id_cita);
        
        if (!cita) {
          return { ...historia, id_mascota: null, mascota: null };
        }

        const mascota = mascotasData.find((m: any) => m.id_mascota === cita.id_mascota);

        if (!mascota) {
          return { ...historia, id_mascota: null, mascota: null };
        }

        const dueno = propietariosData.find((p: any) => p.id_propietario === mascota.id_propietario);
        const tipo = especiesData.find((e: any) => e.id_especie === mascota.id_especie);
        const razaMascota = raiseData.find((r: any) => r.id_raza === mascota.id_raza);

        return {
          ...historia,
          id_mascota: cita.id_mascota,
          id_cita: historia.id_cita,
          mascota: {
            nombre: mascota.nombre,
            sexo: mascota.sexo,
            propietario: dueno ? `${dueno.nombres} ${dueno.apellidos}` : 'Sin dueño',
            especie: tipo ? tipo.nombre : 'Sin especie',
            raza: razaMascota ? razaMascota.nombre_raza : 'Sin raza'
          }
        };
      });

      console.log('6. Historias combinadas:', this.historiasTodas.length);

      this.filtrarHistorias();

      console.log('7. Historias filtradas:', this.listaHistorias.length);

    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async cargarPrescripciones() {
    try {
      const { data: prescripciones } = await this.supabaseService.supabase
        .from('prescripcion')
        .select('*');

      if (!prescripciones) {
        this.listaPrescripciones = [];
        return;
      }

      const { data: medicamentos } = await this.supabaseService.supabase
        .from('medicamento')
        .select('*');
      const medicamentosData: any[] = medicamentos || [];

      const { data: historias } = await this.supabaseService.supabase
        .from('historia_clinica')
        .select('*');
      const historiasData: any[] = historias || [];

      const { data: citas } = await this.supabaseService.supabase
        .from('cita')
        .select('*');
      const citasData: any[] = citas || [];

      const { data: mascotas } = await this.supabaseService.supabase
        .from('mascota')
        .select('*');
      const mascotasData: any[] = mascotas || [];

      this.listaPrescripciones = prescripciones.map((prescripcion: any) => {
        const medicamento = medicamentosData.find((m: any) => m.id_medicamento === prescripcion.id_medicamento);
        const historia = historiasData.find((h: any) => h.id_historia === prescripcion.id_historia);
        const cita = historia ? citasData.find((c: any) => c.id_cita === historia.id_cita) : null;
        const mascota = cita ? mascotasData.find((m: any) => m.id_mascota === cita.id_mascota) : null;

        return {
          ...prescripcion,
          medicamento: medicamento,
          historia_clinica: {
            mascota: mascota
          }
        };
      });

    } catch (error) {
      console.error('Error prescripciones:', error);
      throw error;
    }
  }
}