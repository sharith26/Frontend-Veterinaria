import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropietarioService } from '../../services/propietario.service';
import { RolService } from '../../services/rol.service';
import {ValidatorsUtil } from '../../utils/validators';

@Component({
  selector: 'app-propietario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propietario.component.html',
  styleUrls: ['./propietario.component.css']
})
export class PropietarioComponent implements OnInit {

  listaPropietarios: any[] = [];
  loading: boolean = true;
  mostrarModal: boolean = false;
  editando: boolean = false;
  idSeleccionado: number | null = null;

  propietarioForm = {
    nombres: '',
    apellidos: '',
    tipo_documento: 'CC',
    numero_documento: '',
    telefono: '',
    email: '',
    direccion: ''
  };
  validarTelefono = ValidatorsUtil.validarTelefono;
  validarCedula = ValidatorsUtil.validarCedula;
  validarDireccionBogota = ValidatorsUtil.validarDireccionBogota;

  constructor(
    private propietarioService: PropietarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarPropietarios();
  }

  cargarPropietarios() {
    this.loading = true;

    this.propietarioService.obtenerPropietarios().subscribe({
      next: (data) => {
        this.listaPropietarios = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar propietarios:', err);
        this.loading = false;
      }
    });
  }

  abrirModalCrear() {
    this.editando = false;

    this.propietarioForm = {
      nombres: '',
      apellidos: '',
      tipo_documento: 'CC',
      numero_documento: '',
      telefono: '',
      email: '',
      direccion: ''
    };

    this.mostrarModal = true;
  }

  abrirModalEditar(p: any) {
    this.editando = true;
    this.idSeleccionado = p.id_propietario;
    this.propietarioForm = { ...p };
    this.mostrarModal = true;
  }

  guardarPropietario() {

    if (!this.propietarioForm.nombres.trim()) {
      alert('Debe ingresar los nombres');
      return;
    }

    if (!this.propietarioForm.apellidos.trim()) {
      alert('Debe ingresar los apellidos');
      return;
    }

    if (
      this.propietarioForm.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.propietarioForm.email)
    ) {
      alert('Ingrese un correo válido');
      return;
    }

    if (!this.validarCedula(this.propietarioForm.numero_documento)) {
      alert('La cédula debe tener entre 7 y 10 dígitos');
        return;
    }

    if (!this.validarTelefono(this.propietarioForm.telefono)) {
      alert('El teléfono debe tener exactamente 10 números');
        return;
    }

if (!this.validarDireccionBogota(this.propietarioForm.direccion)) {
  alert('Solo se permiten direcciones de Bogotá');
  return;
}


    if (this.editando && this.idSeleccionado) {

      this.propietarioService
        .actualizarPropietario(this.idSeleccionado, this.propietarioForm)
        .subscribe({
          next: () => {
            this.cargarPropietarios();
            this.cerrarModal();
          },
          error: (err) => {
            console.error(err);
            alert('Error al actualizar propietario');
          }
        });

    } else {

      this.propietarioService
        .crearPropietario(this.propietarioForm)
        .subscribe({
          next: () => {
            this.cargarPropietarios();
            this.cerrarModal();
          },
          error: (err) => {
            console.error(err);
            alert('Error al crear propietario');
          }
        });

    }
  }

  eliminarPropietario(id: number, nombre: string) {
    if (confirm(`¿Eliminar a ${nombre}?`)) {
      this.propietarioService
        .eliminarPropietario(id)
        .subscribe(() => this.cargarPropietarios());
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}