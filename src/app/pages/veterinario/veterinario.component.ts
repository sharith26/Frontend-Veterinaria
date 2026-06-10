import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService } from '../../services/veterinario.service';
import { RolService } from '../../services/rol.service';
import { switchMap } from 'rxjs/operators';
import { ValidatorsUtil } from '../../utils/validators';

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinario.component.html',
  styleUrls: ['./veterinario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VeterinarioComponent implements OnInit {

  listaVeterinarios: any[] = [];
  mostrarModal: boolean = false;
  editando: boolean = false;
  guardando: boolean = false;

  veterinarioForm: any = {
    id_veterinario: null,
    nombre_completo: '',
    email: '',
    telefono: '',
    contrasena: '',
    tarjeta_profesional: '',
    id_especialidad: null,
    id_usuario: null
  };

  listaEspecialidades: any[] = [
    { id: 1, nombre: 'Medicina general y preventiva' },
    { id: 2, nombre: 'Dermatología veterinaria' },
    { id: 3, nombre: 'Cirugía de tejidos blandos' },
    { id: 4, nombre: 'Medicina interna' },
    { id: 5, nombre: 'Oftalmología veterinaria' },
    { id: 6, nombre: 'Odontología veterinaria' }
  ];
  validarTarjetaProfesional = ValidatorsUtil.validarTarjetaProfesional;
  validarCorreoVetPaws = ValidatorsUtil.validarCorreoVetPaws;
  validarTelefono = ValidatorsUtil.validarTelefono;

  constructor(
    private veterinarioService: VeterinarioService,
    public rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

cargarDatos() {
  this.veterinarioService.obtenerVeterinarios().subscribe({
    next: (data: any[]) => {
      console.log("¡Llegaron los datos!", data); 
      this.listaVeterinarios = data;
    },
    error: (err) => {
      console.error("Aquí está el culpable:", err); 
    }
  });
}
  abrirModal(vet?: any) {
    if (vet) {
      this.editando = true;
      this.veterinarioForm = {
        id_veterinario: vet.id_veterinario,
        id_usuario: vet.id_usuario,
        nombre_completo: vet.usuario?.nombre_completo || '',
        email: vet.usuario?.email || '',
        telefono: vet.usuario?.telefono || '',
        contrasena: '',
        tarjeta_profesional: vet.tarjeta_profesional || '',
        id_especialidad: vet.id_especialidad || null
      };
    } else {
      this.editando = false;
      this.veterinarioForm = {
        id_veterinario: null,
        id_usuario: null,
        nombre_completo: '',
        email: '',
        telefono: '',
        contrasena: '',
        tarjeta_profesional: '',
        id_especialidad: null
      };
    }
    this.mostrarModal = true;
  }

  guardarVeterinario() {

  if (!this.veterinarioForm.nombre_completo.trim()) {
    alert('El nombre completo es obligatorio.');
    return;
  }

  if (!this.editando) {

    if (!this.veterinarioForm.email.trim()) {
      alert('El correo es obligatorio.');
      return;
    }

    if (!this.validarCorreoVetPaws(this.veterinarioForm.email)) {
      alert('Solo se permiten correos @vetpaws.co');
      return;
    }

    if (!this.veterinarioForm.contrasena.trim()) {
      alert('La contraseña es obligatoria.');
      return;
    }

    if (!this.validarTelefono(this.veterinarioForm.telefono)) {
      alert('El teléfono debe tener exactamente 10 números.');
      return;
    }
  }

  if (!this.validarTarjetaProfesional(
      this.veterinarioForm.tarjeta_profesional
    )) {
    alert('La tarjeta profesional debe tener el formato TP-00000');
    return;
  }

  this.guardando = true;

  if (this.editando) {

    const dataVet = {
      tarjeta_profesional: this.veterinarioForm.tarjeta_profesional,
      id_especialidad: this.veterinarioForm.id_especialidad
    };

    this.veterinarioService
      .actualizarVeterinario(
        this.veterinarioForm.id_veterinario,
        dataVet
      )
      .subscribe({
        next: (res) => {
          console.log('Actualización exitosa', res);

          this.cargarDatos();
          this.mostrarModal = false;
          this.guardando = false;
        },

        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Error al actualizar los datos.');
          this.guardando = false;
        }
      });

  } else {

    const dataUsuario = {
      nombre_completo: this.veterinarioForm.nombre_completo,
      email: this.veterinarioForm.email,
      telefono: this.veterinarioForm.telefono,
      contrasena: this.veterinarioForm.contrasena,
      id_rol: 3,
      activo: true
    };

    console.log('Usuario a crear:', dataUsuario);

    this.veterinarioService
      .crearUsuario(dataUsuario)
      .pipe(
        switchMap((usuarioCreado: any) => {

          console.log('Usuario creado:', usuarioCreado);

          const idUsuario =
            usuarioCreado.data?.id_usuario ||
            usuarioCreado.id_usuario ||
            usuarioCreado[0]?.id_usuario;

          const dataVet = {
            tarjeta_profesional: this.veterinarioForm.tarjeta_profesional,
            id_especialidad: this.veterinarioForm.id_especialidad,
            id_usuario: idUsuario
          };

          console.log('Veterinario a crear:', dataVet);

          return this.veterinarioService.crearVeterinario(dataVet);
        })
      )
      .subscribe({

        next: (res) => {
          console.log('Registro completo exitoso:', res);

          alert('Veterinario registrado correctamente');

          this.cargarDatos();
          this.mostrarModal = false;
          this.guardando = false;
        },

        error: (err: any) => {

          console.error('Error completo:', err);
          console.error('Respuesta backend:', err.error);

          alert(
            err.error?.detalles ||
            err.error?.message ||
            err.error?.error ||
            'Error al registrar veterinario'
          );

          this.guardando = false;
        }
      });
  }
}

  eliminarVeterinario(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      this.veterinarioService.eliminarVeterinario(id).subscribe(() => this.cargarDatos());
    }
  }
}