import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private apiUrl = 'http://localhost:3000/api/mascota'; 

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

  /**
   * Pega al endpoint específico de tu backend de Node.js/Express 
   * encargado de resolver el JOIN de medicamentos para este ID de mascota.
   */
  obtenerMedicamentosPorMascota(idMascota: number): Observable<any[]> {
  const headers = this.obtenerHeaders().set('Cache-Control', 'no-cache').set('Pragma', 'no-cache');
  return this.http.get<any[]>(`${this.apiUrl}/${idMascota}/medicamentos`, { headers });
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