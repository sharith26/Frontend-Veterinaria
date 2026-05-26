import { Component, OnInit } from '@angular/core';
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

  // Manejo de estado del modal dinámico
  mascotaSeleccionada: any = null;
  medicamentosDeMascota: any[] = [];
  mostrarModalMedicamento: boolean = false;
  
  loading: boolean = true;
  errorMensaje: string = '';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.loading = true;
    this.errorMensaje = '';
    
    try {
      await Promise.all([
        this.cargarHistorias(),
        this.cargarMedicamentos(),
        this.cargarPrescripciones()
      ]);
    } catch (error) {
      console.error("Error al sincronizar las tablas de Supabase:", error);
      this.errorMensaje = "Ocurrió un error al obtener la información de la base de datos.";
    } finally {
      this.loading = false;
    }
  }

  /**
   * Filtra las prescripciones de la mascota en tiempo real de forma local
   */
  verMedicamentosPorMascota(historia: any) {
    // Asignamos la mascota de la fila seleccionada
    this.mascotaSeleccionada = historia.mascota;
    
    // Cruzamos la lista de prescripciones general buscando las que pertenezcan a esta mascota
    this.medicamentosDeMascota = this.listaPrescripciones.filter((prescripcion: any) => {
      return prescripcion.historia_clinica?.mascota?.nombre === historia.mascota?.nombre;
    });

    // Abrimos el modal flotante
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

    if (error) throw error;
    this.listaMedicamentos = data || [];
  }

  async cargarHistorias() {
    const { data, error } = await this.supabaseService.supabase
      .from('historia_clinica')
      .select(`
        id_historia,
        diagnostico,
        tratamiento,
        observaciones,
        fecha_apertura,
        mascota (nombre, especie, raza, edad, propietario),
        veterinario (nombres, apellidos)
      `);
      
    if (error) throw error;
    this.listaHistorias = data || [];
  }

  async cargarPrescripciones() {
    const { data, error } = await this.supabaseService.supabase
      .from('prescripcion')
      .select(`
        id_prescripcion,
        dosis,
        cantidad,
        medicamento (nombre),
        historia_clinica (
          mascota (nombre)
        )
      `);

    if (error) throw error;
    this.listaPrescripciones = data || [];
  }
}