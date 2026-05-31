import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { rolGuard } from './guards/rol.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/auth.component').then(m => m.AuthComponent)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'historial/:id',
    loadComponent: () =>
      import('./pages/historial/historial.component').then(m => m.HistorialComponent),
    canActivate: [authGuard, rolGuard(['Superadmin', 'Administrador', 'Veterinario', 'Recepcionista', 'Consultas'])]
  },

  {
    path: 'propietario',
    loadComponent: () =>
      import('./pages/propietario/propietario.component').then(m => m.PropietarioComponent),
    canActivate: [authGuard, rolGuard(['Superadmin', 'Administrador', 'Recepcionista', 'Consultas'])]
  },

  {
    path: 'citas',
    loadComponent: () =>
      import('./pages/cita/cita.component').then(m => m.CitaComponent),
    canActivate: [authGuard, rolGuard(['Superadmin', 'Administrador', 'Veterinario', 'Recepcionista', 'Consultas'])]
  },

  {
    path: 'veterinario',
    loadComponent: () =>
      import('./pages/veterinario/veterinario.component').then(m => m.VeterinarioComponent),
    canActivate: [authGuard]
  },

  {
    path: 'sin-acceso',
    loadComponent: () =>
      import('./pages/sin-acceso/sin-acceso.component').then(m => m.SinAccesoComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];