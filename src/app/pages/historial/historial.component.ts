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

  // Variables para el modal
  medicamentoSeleccionado: any = null;
  mostrarModalMedicamento: boolean = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  async cargarDatos() {
    await Promise.all([
      this.cargarHistorias(),
      this.cargarMedicamentos(),
      this.cargarPrescripciones()
    ]);
  }

  // --- MÉTODOS DEL MODAL ---
  verDetalle(medicamento: any) {
    this.medicamentoSeleccionado = medicamento;
    this.mostrarModalMedicamento = true;
  }

  cerrarModalMedicamento() {
    this.mostrarModalMedicamento = false;
  }

  // --- CARGA DE DATOS ---
  async cargarMedicamentos() {
    const { data, error } = await this.supabaseService.supabase
      .from('medicamento')
      .select('*');

    if (error) {
      console.error("Error al cargar medicamentos:", error);
    } else {
      this.listaMedicamentos = data || [];
    }
  }

  async cargarHistorias() {
    const { data, error } = await this.supabaseService.supabase
      .from('historia_clinica')
      .select(`
        diagnostico,
        fecha_apertura,
        mascota:id_mascota (nombre),
        veterinario:id_veterinario (nombres, apellidos)
      `);
    if (data) this.listaHistorias = data;
  }

  async cargarPrescripciones() {
    const { data, error } = await this.supabaseService.supabase
      .from('prescripcion')
      .select(`
        dosis, frecuencia,
        mascota:id_mascota (nombre),
        medicamento:id_medicamento (nombre)
      `);
    if (data) this.listaPrescripciones = data;
  }
}