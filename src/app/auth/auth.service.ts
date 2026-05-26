import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  private async calcularSHA256(texto: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async login(email: string, password: string) {
    const supabase = this.supabaseService.supabase;
    const emailLimpio = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from('usuario')
      .select(`
        id_usuario,
        email,
        contrasena,
        rol (
          nombre_rol
        )
      `)
      .eq('email', emailLimpio)
      .single();

    if (error || !data) {
      console.error('Error de Supabase o usuario no encontrado:', error);
      throw new Error('Usuario no encontrado');
    }

    const passwordHasheada = await this.calcularSHA256(password);

    if (data.contrasena !== passwordHasheada) {
      console.error('La contraseña no coincide con el hash de la BD');
      throw new Error('Contraseña incorrecta');
    }

    const rolData: any = data.rol;
    const rolUsuario = Array.isArray(rolData) ? rolData[0]?.nombre_rol : rolData?.nombre_rol;
    const rolFinal = rolUsuario || 'Consultas';

    const payloadFake = { 
      id: data.id_usuario, 
      rol: rolFinal, 
      exp: Date.now() + 28800000 
    };

    localStorage.setItem('token', btoa(JSON.stringify(payloadFake)));
    localStorage.setItem('rol', rolFinal);

    return data;
  }
}