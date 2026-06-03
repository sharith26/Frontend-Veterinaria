import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private url = 'http://localhost:3000/api/facturas';
  private urlDetalle = 'http://localhost:3000/api/detalle-factura';

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  crearFacturaConDetalles(factura: any): Observable<any> {
  // Asegúrate de que esta URL coincida con tu endpoint de backend
  return this.http.post('http://localhost:3000/api/facturas', factura);
}   

obtenerCitasPorMascota(idMascota: string) {
  return this.http.get<any[]>(`http://localhost:3000/api/citas/mascota/${idMascota}`);
}

  obtenerFacturaCompleta(id: number) {
    return forkJoin({
      factura: this.http.get(`${this.url}/${id}`, { headers: this.obtenerHeaders() }),
      detalles: this.http.get(`${this.urlDetalle}?id_factura=${id}`, { headers: this.obtenerHeaders() })
    }).pipe(
      map(data => ({ ...data.factura, detalles: data.detalles }))
    );
  }
}