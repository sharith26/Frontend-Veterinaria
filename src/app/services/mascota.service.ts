import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

  constructor(private supabaseService: SupabaseService) {}

  obtenerMascotas(): Observable<any[]> {
    return from(
      this.supabaseService.supabase
        .from('mascota')
        .select(`
          id_mascota,
          nombre,
          fecha_nacimiento,
          sexo,
          peso_actual,
          color,
          activo,
          propietario:id_propietario (nombres, apellidos),
          especie:id_especie (nombre_especie),
          raza:id_raza (nombre_raza)
        `)
        .order('nombre', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  obtenerMedicamentosPorMascota(idMascota: number): Observable<any[]> {
    return from(
      this.supabaseService.supabase
        .from('prescripcion')
        .select(`
          id_prescripcion,
          dosis,
          cantidad,
          medicamento:id_medicamento (nombre),
          historia_clinica:id_historia (
            id_historia,
            cita:id_cita (
              id_mascota
            )
          )
        `)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).filter((p: any) =>
          p.historia_clinica?.cita?.id_mascota === idMascota
        );
      })
    );
  }

  obtenerHistorialPorMascota(idMascota: number): Observable<any[]> {
    return from(
      this.supabaseService.supabase
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
          cita:id_cita (id_cita, id_mascota)
        `)
        .order('fecha_consulta', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).filter((h: any) =>
          h.cita?.id_mascota === idMascota
        );
      })
    );
  }

  obtenerEspecies(): Observable<any[]> {
    return from(
      this.supabaseService.supabase
        .from('especie')
        .select('id_especie, nombre_especie')
        .order('nombre_especie', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  obtenerRazas(): Observable<any[]> {
    return from(
      this.supabaseService.supabase
        .from('raza')
        .select('id_raza, nombre_raza, id_especie')
        .order('nombre_raza', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  obtenerPropietariosLista(): Observable<any[]> {
    return from(
      this.supabaseService.supabase
        .from('propietario')
        .select('id_propietario, nombres, apellidos')
        .order('nombres', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  obtenerVeterinarios(): Observable<any[]> {
    return from(
      this.supabaseService.supabase
        .from('veterinario')
        .select('*')
        .order('nombre', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  crearMascota(mascota: any): Observable<any> {
    return from(
      this.supabaseService.supabase
        .from('mascota')
        .insert([mascota])
        .select()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  actualizarMascota(id: number, mascota: any): Observable<any> {
    return from(
      this.supabaseService.supabase
        .from('mascota')
        .update(mascota)
        .eq('id_mascota', id)
        .select()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  eliminarMascota(id: number): Observable<any> {
    return from(
      this.supabaseService.supabase
        .from('mascota')
        .delete()
        .eq('id_mascota', id)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }
}