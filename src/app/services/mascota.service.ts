import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private apiUrl = `${environment.apiUrl}/api/mascota`;
  private urlMascotas = `${environment.apiUrl}/api/mascotas`;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerMascotas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
  }

  obtenerMedicamentosPorMascota(idMascota: number): Observable<any[]> {
    const ts = new Date().getTime();
    return this.http.get<any[]>(`${this.apiUrl}/${idMascota}/medicamentos?t=${ts}`, { headers: this.obtenerHeaders() });
  }

  obtenerHistorialPorMascota(idMascota: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idMascota}/historial`, { headers: this.obtenerHeaders() });
  }

  obtenerEspecies(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/especie`, { headers: this.obtenerHeaders() });
  }

  obtenerRazas(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/raza`, { headers: this.obtenerHeaders() });
  }

  obtenerPropietariosLista(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/propietario`, { headers: this.obtenerHeaders() });
  }

  obtenerPorPropietario(idPropietario: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlMascotas}/filtrar?id_propietario=${idPropietario}`);
  }

  obtenerVeterinarios(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/veterinario`, { headers: this.obtenerHeaders() });
  }

  crearMascota(mascota: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, mascota, { headers: this.obtenerHeaders() });
  }

  actualizarMascota(id: number, mascota: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, mascota, { headers: this.obtenerHeaders() });
  }

  eliminarMascota(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}