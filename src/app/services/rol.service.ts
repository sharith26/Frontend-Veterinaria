import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RolService {

  getRol(): string {
    return localStorage.getItem('rol') || '';
  }

  // ¿Puede ver la sección?
  puede(accion: string): boolean {
    const rol = this.getRol();
    const permisos: Record<string, string[]> = {

      // Módulos visibles
      verMascotas:       ['Superadmin', 'Administrador', 'Veterinario', 'Recepcionista', 'Consultas'],
      verCitas:          ['Superadmin', 'Administrador', 'Veterinario', 'Recepcionista', 'Consultas'],
      verPropietarios:   ['Superadmin', 'Administrador', 'Recepcionista', 'Consultas'],
      verFacturas:       ['Superadmin', 'Administrador', 'Recepcionista', 'Consultas'],
      verHistorial:      ['Superadmin', 'Administrador', 'Veterinario', 'Consultas'],
      verMedicamentos:   ['Superadmin', 'Administrador', 'Veterinario', 'Consultas'],
      verUsuarios:       ['Superadmin'],
      verVeterinarios:   ['Superadmin'],

      // Acciones en mascotas
      crearMascota:      ['Superadmin', 'Administrador', 'Recepcionista'],
      editarMascota:     ['Superadmin', 'Administrador'],
      eliminarMascota:   ['Superadmin', 'Administrador'],

      // Acciones en citas
      crearCita:         ['Superadmin', 'Administrador', 'Recepcionista'],
      editarCita:        ['Superadmin', 'Administrador', 'Recepcionista'],
      eliminarCita:      ['Superadmin', 'Administrador'],

      // Acciones en propietarios
      crearPropietario:  ['Superadmin', 'Administrador', 'Recepcionista'],
      editarPropietario: ['Superadmin', 'Administrador', 'Recepcionista'],
      eliminarPropietario:['Superadmin', 'Administrador'],

      // Acciones en facturas
      crearFactura:      ['Superadmin', 'Administrador', 'Recepcionista'],
      editarFactura:     ['Superadmin', 'Administrador', 'Recepcionista'],
      eliminarFactura:   ['Superadmin'],

      // Acciones en historial clínico
      crearHistorial:    ['Superadmin', 'Veterinario'],
      editarHistorial:   ['Superadmin', 'Veterinario'],
      eliminarHistorial: ['Superadmin'],

      // Acciones en prescripciones
      crearPrescripcion: ['Superadmin', 'Veterinario'],
      editarPrescripcion:['Superadmin', 'Veterinario'],
      eliminarPrescripcion:['Superadmin'],

      // Acciones en medicamentos
      crearMedicamento:  ['Superadmin'],
      editarMedicamento: ['Superadmin'],
      eliminarMedicamento:['Superadmin'],

      // Acciones en usuarios
      crearUsuario:      ['Superadmin'],
      editarUsuario:     ['Superadmin'],
      eliminarUsuario:   ['Superadmin'],

      // Acciones en veterinarios
      crearVeterinario:  ['Superadmin'],
      editarVeterinario: ['Superadmin'],
      eliminarVeterinario:['Superadmin'],
    };

    return permisos[accion]?.includes(rol) ?? false;
  }
}