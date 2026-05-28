import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PropietarioService {
  private apiUrl = 'http://localhost:3000/api/propietario';

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerPropietarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() })
      .pipe(catchError(err => {
        console.error("Error en servicio:", err);
        return throwError(() => err);
      }));
  }

  crearPropietario(propietario: any): Observable<any> {
    return this.http.post(this.apiUrl, propietario, { headers: this.obtenerHeaders() });
  }

  actualizarPropietario(id: number, propietario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, propietario, { headers: this.obtenerHeaders() });
  }

  eliminarPropietario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() });
  }
}