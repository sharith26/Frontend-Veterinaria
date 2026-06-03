import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioService {
  private apiUrl = `${environment.apiUrl}/api/veterinario`;
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

  obtenerVeterinarios() {
    return from(
      this.supabase
        .from('veterinario')
        .select(`
          id_veterinario,
          tarjeta_profesional,
          id_usuario,
          id_especialidad,
          usuario(nombre_completo),
          especialidad(nombre)
        `)
    ).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return res.data || [];
      })
    );
  }

  crearVeterinario(veterinario: any): Observable<any> {
    return this.http.post(this.apiUrl, veterinario, { headers: this.obtenerHeaders() });
  }

  actualizarVeterinario(id: number, veterinario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, veterinario, { headers: this.obtenerHeaders() });
  }

  eliminarVeterinario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}