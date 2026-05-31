import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private apiUrl = 'http://localhost:3000/api/veterinario';

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerVeterinarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
  }

  crearVeterinario(veterinario: any): Observable<any> {
    return this.http.post(this.apiUrl, veterinario, { headers: this.obtenerHeaders() });
  }

  actualizarVeterinario(id: number, veterinario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, veterinario, { headers: this.obtenerHeaders() });
  }

  eliminarVeterinario(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.obtenerHeaders() })
    .pipe(
      catchError(err => {
        console.error("Error al eliminar:", err);
        // Aquí podrías lanzar una alerta personalizada si el backend responde con un error
        return throwError(() => err);
      })
    );
}
}