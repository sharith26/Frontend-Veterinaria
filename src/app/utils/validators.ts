export class ValidatorsUtil {

  static validarTelefono(telefono: string): boolean {
    return /^[0-9]{10}$/.test(telefono);
  }

  static validarCorreoVetPaws(correo: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@vetpaws\.co$/.test(correo);
  }

  static validarTarjetaProfesional(tp: string): boolean {
    return /^TP-\d{5}$/.test(tp);
  }

  static validarCedula(cedula: string): boolean {
    return /^\d{7,10}$/.test(cedula);
  }

  static validarDireccionBogota(direccion: string): boolean {
    return /bogot[aá]/i.test(direccion);
  }

}