import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'http://localhost:3000/api/cita';

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
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