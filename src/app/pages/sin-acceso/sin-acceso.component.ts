import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sin-acceso',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div class="text-center p-5 bg-white rounded-4 shadow">
        <div style="font-size: 4rem;">🔒</div>
        <h2 class="fw-bold text-danger mt-3">Acceso Denegado</h2>
        <p class="text-muted">No tienes permisos para ver esta sección.</p>
        <button class="btn btn-primary fw-bold px-4" (click)="volver()">
          Volver al Dashboard
        </button>
      </div>
    </div>
  `
})
export class SinAccesoComponent {
  constructor(private router: Router) {}
  volver() { this.router.navigate(['/dashboard']); }
}