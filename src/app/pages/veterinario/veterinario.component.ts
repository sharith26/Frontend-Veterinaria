import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService } from '../../services/veterinario.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinario.component.html',
  styleUrls: ['./veterinario.component.css'],
  encapsulation: ViewEncapsulation.None  // ← esto es clave
})
export class VeterinarioComponent implements OnInit {
  listaVeterinarios: any[] = [];
  mostrarModal: boolean = false;
  editando: boolean = false;
  
  veterinarioForm: any = {
    id_veterinario: null,
    nombre_completo: '',
    especialidad: '',
    tarjeta_profesional: ''
  };

  constructor(
    private veterinarioService: VeterinarioService,
    public rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.veterinarioService.obtenerVeterinarios().subscribe((data: any) => {
      // Como tu servicio ya devuelve 'data', asignamos directo
      this.listaVeterinarios = data;
      console.log("Datos cargados con relaciones:", this.listaVeterinarios);
    });
  }

  abrirModal(vet?: any) {
    if (vet) {
      this.editando = true;
      this.veterinarioForm = { 
        id_veterinario: vet.id_veterinario,
        tarjeta_profesional: vet.tarjeta_profesional,
        id_usuario: vet.id_usuario,
        id_especialidad: vet.id_especialidad,
        nombre_completo: vet.usuario?.nombre_completo || '',
        especialidad: vet.especialidad?.nombre || ''
      };
    } else {
      this.editando = false;
      this.veterinarioForm = { nombre_completo: '', especialidad: '', tarjeta_profesional: '' };
    }
    this.mostrarModal = true;
  }

  guardarVeterinario() {
    // AQUÍ es donde vive la lógica para preparar los datos
    const dataParaGuardar = {
      id_usuario: this.veterinarioForm.id_usuario,
      id_especialidad: this.veterinarioForm.id_especialidad,
      tarjeta_profesional: this.veterinarioForm.tarjeta_profesional
    };

    if (this.editando) {
      this.veterinarioService.actualizarVeterinario(this.veterinarioForm.id_veterinario, dataParaGuardar)
        .subscribe(() => { this.cargarDatos(); this.mostrarModal = false; });
    } else {
      this.veterinarioService.crearVeterinario(dataParaGuardar)
        .subscribe(() => { this.cargarDatos(); this.mostrarModal = false; });
    }
  }

  eliminarVeterinario(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      this.veterinarioService.eliminarVeterinario(id).subscribe(() => this.cargarDatos());
    }
  }
}