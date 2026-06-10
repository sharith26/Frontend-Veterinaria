import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VeterinarioService {
  private apiUrl = `${environment.apiUrl}/api/veterinario`;
  private usuarioUrl = `${environment.apiUrl}/api/usuario`;

  constructor(private http: HttpClient) {}

  obtenerVeterinarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); 
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.usuarioUrl, usuario);
  }

  crearVeterinario(veterinario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, veterinario);
  }

  actualizarVeterinario(id: number, veterinario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, veterinario);
  }

  eliminarVeterinario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
