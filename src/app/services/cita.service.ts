import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = `${environment.apiUrl}/api/cita`;
  private supabase: SupabaseClient;

  constructor(private http: HttpClient) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

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