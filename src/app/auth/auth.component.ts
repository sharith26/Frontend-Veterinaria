import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service'; 

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.css']
})
export class AuthComponent {
  loginForm: FormGroup;
  errorMensaje: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

async onSubmit() {

  if (this.loginForm.invalid) return;

  this.loading = true;
  this.errorMensaje = '';

  const { email, password } = this.loginForm.value;

  try {

    await this.authService.login(email, password);

    this.router.navigate(['/dashboard']);

  } catch (error) {

    this.errorMensaje = 'Usuario o contraseña incorrectos';
    this.loading = false;

    }
  }
}