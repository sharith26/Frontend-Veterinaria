import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  idMascota: number = 0;
  mascota: any = null;
  historias: any[] = [];
  loading: boolean = true;
  errorMensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.idMascota = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  async cargarDatos() {
    this.loading = true;
    try {
      const { data: mascotaData, error: errorMascota } = await this.supabaseService.supabase
        .from('mascota')
        .select(`
          id_mascota, nombre, fecha_nacimiento, activo,
          especie:id_especie (nombre_especie),
          raza:id_raza (nombre_raza),
          propietario:id_propietario (nombres, apellidos)
        `)
        .eq('id_mascota', this.idMascota)
        .single();

      if (errorMascota) throw errorMascota;
      this.mascota = mascotaData;

      const { data: citas, error: errorCitas } = await this.supabaseService.supabase
        .from('cita')
        .select('id_cita')
        .eq('id_mascota', this.idMascota);

      if (errorCitas) throw errorCitas;
      if (!citas || citas.length === 0) { this.loading = false; return; }

      const idsCitas = citas.map((c: any) => c.id_cita);

      const { data: historiasData, error: errorHistorias } = await this.supabaseService.supabase
        .from('historia_clinica')
        .select(`
          id_historia, fecha_consulta, peso_kg, temperatura_c,
          frec_cardiaca, frec_respiratoria, sintomas,
          diagnostico, tratamiento, observaciones, id_cita
        `)
        .in('id_cita', idsCitas)
        .order('fecha_consulta', { ascending: false });

      if (errorHistorias) throw errorHistorias;
      this.historias = historiasData || [];

    } catch (error: any) {
      console.error('Error cargando historial:', error);
      this.errorMensaje = 'Error al cargar el historial clínico.';
    } finally {
      this.loading = false;
    }
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}