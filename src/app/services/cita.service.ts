import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
// 1. Importa Supabase
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:3000/api/cita';
  // 2. Declara el cliente de Supabase
  private supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    // 3. Inicializa Supabase
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Mantiene tu lógica de obtener citas con Supabase
  // Asegúrate de que esto esté en tu cita.service.ts
obtenerCitas() {
  return from(
    this.supabase
      .from('cita')
      .select(`
        id_cita, fecha, hora, motivo, estado, id_usuario_agenda,
        mascota(id_mascota, nombre),
        veterinario(id_veterinario, usuario(nombre_completo))
      `)
  ).pipe(map((res: any) => res.data || []));
}

  // Mantiene tu lógica original con el backend para las otras operaciones
  crearCita(cita: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cita, { headers: this.obtenerHeaders() });
  }

  actualizarCita(id: number, cita: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cita, { headers: this.obtenerHeaders() });
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}