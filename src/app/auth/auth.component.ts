import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ValidatorsUtil } from '../utils/validators';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@vetpaws\.co$/)
        ]
      ],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit() {

  if (this.authForm.invalid) {
    this.errorMensaje =
      'Por favor, introduce un correo y contraseña válidos.';
    return;
  }

  const { email, password } = this.authForm.value;

  const correoVetPaws =
    /^[a-zA-Z0-9._%+-]+@vetpaws\.co$/;

  if (!correoVetPaws.test(email)) {
    this.errorMensaje =
      'Solo se permiten correos @vetpaws.co';
    return;
  }

  this.loading = true;
  this.errorMensaje = '';
  this.authForm.disable();

  try {

    await this.authService.login(
      email,
      password
    );

    this.router.navigate(['/dashboard']);

  } catch (error: any) {

    console.error('Error capturado:', error);

    this.errorMensaje =
      'Usuario o contraseña incorrectos';

    this.authForm.enable();

  } finally {

    this.loading = false;
    }
  }
}