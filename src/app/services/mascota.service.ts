import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  // URL de tu API de Node.js/Express
  private apiUrl = 'http://localhost:3000/api/mascota'; 

  constructor(private http: HttpClient) {}

private obtenerHeaders() {
  const token = localStorage.getItem('token');
  
  // Esto nos dirá en la consola qué está enviando realmente tu app
  console.log("Token enviado en headers:", token); 
  
  return new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '' // Si no hay token, no enviamos 'Bearer null'
  });
}

  obtenerMascotas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.obtenerHeaders() });
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