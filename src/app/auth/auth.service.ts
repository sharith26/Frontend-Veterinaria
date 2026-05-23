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

  async login(email: string, password: string) {

    const supabase = this.supabaseService.supabase;

    const { data, error } = await supabase
      .from('usuario')
      .select(`
        id_usuario,
        email,
        contrasena,
        rol:id_rol (
          nombre_rol
        )
      `)
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('Usuario no encontrado');
    }

    if (data.contrasena !== password) {
      throw new Error('Contraseña incorrecta');
    }

    localStorage.setItem('token', 'sesion-activa');
    const rolUsuario = Array.isArray(data.rol)
    ? data.rol[0]?.nombre_rol
    : (data.rol as any)?.nombre_rol;

localStorage.setItem('rol', rolUsuario);

    return data;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}