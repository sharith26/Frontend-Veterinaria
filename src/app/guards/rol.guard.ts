import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const rolGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const rol = localStorage.getItem('rol') || '';
    if (rolesPermitidos.includes(rol)) {
      return true;
    }
    router.navigate(['/sin-acceso']);
    return false;
  };
};