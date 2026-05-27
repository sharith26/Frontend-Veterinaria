import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  private apiUrl =
    'http://localhost:3000/api/historia-clinica';

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
        ? `Bearer ${token}`
        : ''
    });
  }

  obtenerHistorias(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl,
      {
        headers: this.obtenerHeaders()
      }
    );
  }
}