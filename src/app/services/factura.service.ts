import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private url = `${environment.apiUrl}/api/facturas`;
  private urlDetalle = `${environment.apiUrl}/api/detalle-factura`;

  constructor(private http: HttpClient) {}

  private obtenerHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  crearFacturaConDetalles(factura: any): Observable<any> {
    return this.http.post(this.url, factura);
  }

  obtenerCitasPorMascota(idMascota: string) {
    return this.http.get<any[]>(`${environment.apiUrl}/api/citas/mascota/${idMascota}`);
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