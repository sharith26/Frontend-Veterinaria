import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {

  idMascota: number = 0;
  mascota: any = null;
  historias: any[] = [];
  loading: boolean = true;
  errorMensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idMascota = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    this.mascotaService.obtenerHistorialPorMascota(this.idMascota).subscribe({
      next: (data: any) => {
        this.mascota = data.mascota;
        this.historias = data.historias || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando historial:', err);
        this.errorMensaje = 'Error al cargar el historial clínico.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}