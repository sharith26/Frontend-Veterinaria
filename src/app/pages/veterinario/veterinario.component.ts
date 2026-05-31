import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeterinarioService } from '../../services/veterinario.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinario.component.html'
})
export class VeterinarioComponent implements OnInit {
  listaVeterinarios: any[] = [];
  mostrarModal = false;
  editando = false;
  idSeleccionado: number | null = null;
  veterinarioForm = { nombre: '', especialidad: '', tarjeta_profesional: '', email: '' };

  constructor(
    private vetService: VeterinarioService,
    public rolService: RolService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVeterinarios();
  }

  cargarVeterinarios() {
    this.vetService.obtenerVeterinarios().subscribe(data => {
      this.listaVeterinarios = data;
      this.cdr.detectChanges();
    });
  }

  guardarVeterinario() {
    if (this.editando && this.idSeleccionado) {
      this.vetService.actualizarVeterinario(this.idSeleccionado, this.veterinarioForm).subscribe(() => this.finalizarGuardado());
    } else {
      this.vetService.crearVeterinario(this.veterinarioForm).subscribe(() => this.finalizarGuardado());
    }
  }

  private finalizarGuardado() {
    this.cargarVeterinarios();
    this.mostrarModal = false;
  }

  abrirModal(v: any = null) {
    this.editando = !!v;
    this.veterinarioForm = v ? { ...v } : { nombre: '', especialidad: '', tarjeta_profesional: '', email: '' };
    this.mostrarModal = true;
  }
  // En tu archivo veterinario.component.ts, asegúrate de tener este método:
eliminarVeterinario(id: number, nombre: string) {
  if (confirm(`¿Eliminar a ${nombre}?`)) {
    this.vetService.eliminarVeterinario(id).subscribe(() => {
      this.cargarVeterinarios();
    });
  }
}
  }
