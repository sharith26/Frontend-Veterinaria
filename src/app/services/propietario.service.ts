import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {
  private apiUrl = `${environment.apiUrl}/api/propietario`;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerPropietarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
  }

  obtenerPropietarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }

  crearPropietario(propietario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, propietario, { headers: this.obtenerHeaders() });
  }

  actualizarPropietario(id: number, propietario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, propietario, { headers: this.obtenerHeaders() });
  }

  eliminarPropietario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}