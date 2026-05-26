import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // 👈 Añadido ReactiveFormsModule
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true, // 👈 Si tu componente es Standalone, asegúrate de tener esto
  imports: [ReactiveFormsModule], // 👈 IMPORTANTE: Esto quita el error de formGroup
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup;
  loading: boolean = false;
  errorMensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.authForm.invalid) {
      this.errorMensaje = 'Por favor, introduce un correo y contraseña válidos.';
      return;
    }

    this.loading = true;
    this.errorMensaje = '';
    this.authForm.disable(); 

    const { email, password } = this.authForm.value;

    try {
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']); 
    } catch (error: any) {
      console.error('Error capturado en el componente:', error);
      this.errorMensaje = 'Usuario o contraseña incorrectos';
      this.authForm.enable();
    } finally {
      this.loading = false;
    }
  }
}