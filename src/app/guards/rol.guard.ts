import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RolService } from '../services/rol.service';

export const rolGuard = (permiso: string[] | string): CanActivateFn => {
  return () => {
    const rolService = inject(RolService);
    const router = inject(Router);
    const rol = localStorage.getItem('rol') || '';

    if (Array.isArray(permiso)) {
      if (permiso.includes(rol)) return true;
    } 
    else {
      if (rolService.puede(permiso)) return true;
    }

    router.navigate(['/sin-acceso']);
    return false;
  };
};