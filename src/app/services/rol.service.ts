import { Injectable } from '@angular/core';

// Definimos constantes para evitar errores de escritura ("Superadmin" vs "superadmin")
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

  // ¿Puede realizar la acción?
  puede(accion: string): boolean {
    const rol = this.getRol();
    
    // Mantenemos toda tu lógica original intacta
    const permisos: Record<string, string[]> = {
      // Módulos visibles
      verMascotas:      [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verCitas:         [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verPropietarios:  [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verFacturas:      [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA, ROLES.CONSULTAS],
      verHistorial:     [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.CONSULTAS],
      verMedicamentos:  [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VET, ROLES.CONSULTAS],
      verUsuarios:      [ROLES.SUPERADMIN],
      verVeterinarios:  [ROLES.SUPERADMIN],

      // Acciones en mascotas
      crearMascota:     [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarMascota:    [ROLES.SUPERADMIN, ROLES.ADMIN],
      eliminarMascota:  [ROLES.SUPERADMIN, ROLES.ADMIN],

      // Acciones en citas
      crearCita:        [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarCita:       [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      eliminarCita:     [ROLES.SUPERADMIN, ROLES.ADMIN],

      // Acciones en propietarios
      crearPropietario: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarPropietario:[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      eliminarPropietario:[ROLES.SUPERADMIN, ROLES.ADMIN],

      // Acciones en facturas
      crearFactura:     [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      editarFactura:    [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.RECEPCIONISTA],
      eliminarFactura:  [ROLES.SUPERADMIN],

      // Acciones en historial clínico
      crearHistorial:   [ROLES.SUPERADMIN, ROLES.VET],
      editarHistorial:  [ROLES.SUPERADMIN, ROLES.VET],
      eliminarHistorial:[ROLES.SUPERADMIN],

      // Acciones en prescripciones
      crearPrescripcion: [ROLES.SUPERADMIN, ROLES.VET],
      editarPrescripcion:[ROLES.SUPERADMIN, ROLES.VET],
      eliminarPrescripcion:[ROLES.SUPERADMIN],

      // Acciones en medicamentos
      crearMedicamento:  [ROLES.SUPERADMIN],
      editarMedicamento: [ROLES.SUPERADMIN],
      eliminarMedicamento:[ROLES.SUPERADMIN],

      // Acciones en usuarios
      crearUsuario:      [ROLES.SUPERADMIN],
      editarUsuario:     [ROLES.SUPERADMIN],
      eliminarUsuario:   [ROLES.SUPERADMIN],

      // Acciones en veterinarios
      crearVeterinario:  [ROLES.SUPERADMIN],
      editarVeterinario: [ROLES.SUPERADMIN],
      eliminarVeterinario:[ROLES.SUPERADMIN],
    };

    return permisos[accion]?.includes(rol) ?? false;
  }
}