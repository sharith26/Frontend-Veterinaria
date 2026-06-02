import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RolService } from '../services/rol.service';

// Acepta un arreglo OR un string (acción)
export const rolGuard = (permiso: string[] | string): CanActivateFn => {
  return () => {
    const rolService = inject(RolService);
    const router = inject(Router);
    const rol = localStorage.getItem('rol') || '';

    // Lógica antigua: si es un arreglo, verifica si el rol está incluido
    if (Array.isArray(permiso)) {
      if (permiso.includes(rol)) return true;
    } 
    // Lógica nueva: si es un string (acción), usa tu método puede()
    else {
      if (rolService.puede(permiso)) return true;
    }

    router.navigate(['/sin-acceso']);
    return false;
  };
};