import { Injectable } from '@angular/core';

export const ROLES = {
  SUPERADMIN: 'Superadmin',
  ADMIN: 'Administrador',
  VET: 'Veterinario',
  RECEPCIONISTA: 'Recepcionista',
  CONSULTAS: 'Consultas'
};

@Injectable({ providedIn: 'root' })
export class RolService {

  getRol(): string {
    return localStorage.getItem('rol') || '';
  }

  puede(accion: string): boolean {
    const rol = this.getRol();
    
    const permisos: Record<string, string[]> = {
      verMascotas:      [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verCitas:         [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verPropietarios:  [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verFacturas:      [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verHistorial:     [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.CONSULTAS],
      verMedicamentos:  [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.CONSULTAS],
      verUsuarios:      [ROLES.SUPERADMIN],
      verVeterinarios:  [ROLES.SUPERADMIN],

      crearMascota:     [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarMascota:    [ROLES.SUPERADMIN, ROLES.ADMIN],
      eliminarMascota:  [ROLES.SUPERADMIN, ROLES.ADMIN],

      crearCita:        [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarCita:       [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      eliminarCita:     [ROLES.SUPERADMIN, ROLES.ADMIN],

      crearPropietario: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarPropietario:[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      eliminarPropietario:[ROLES.SUPERADMIN, ROLES.ADMIN],

      crearFactura:     [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarFactura:    [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      eliminarFactura:  [ROLES.SUPERADMIN],

      crearHistorial:   [ROLES.SUPERADMIN, ROLES.VET],
      editarHistorial:  [ROLES.SUPERADMIN, ROLES.VET],
      eliminarHistorial:[ROLES.SUPERADMIN],

      crearPrescripcion: [ROLES.SUPERADMIN, ROLES.VET],
      editarPrescripcion:[ROLES.SUPERADMIN, ROLES.VET],
      eliminarPrescripcion:[ROLES.SUPERADMIN],

      crearMedicamento:  [ROLES.SUPERADMIN],
      editarMedicamento: [ROLES.SUPERADMIN],
      eliminarMedicamento:[ROLES.SUPERADMIN],

      crearUsuario:      [ROLES.SUPERADMIN],
      editarUsuario:     [ROLES.SUPERADMIN],
      eliminarUsuario:   [ROLES.SUPERADMIN],

      crearVeterinario:  [ROLES.SUPERADMIN],
      editarVeterinario: [ROLES.SUPERADMIN],
      eliminarVeterinario:[ROLES.SUPERADMIN],
    };

    return permisos[accion]?.includes(rol) ?? false;
  }
}