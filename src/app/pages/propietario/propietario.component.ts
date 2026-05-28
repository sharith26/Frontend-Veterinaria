import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropietarioService } from '../../services/propietario.service';
import { RolService } from '../../services/rol.service';

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
    nombres: '', apellidos: '', tipo_documento: 'CC',
    numero_documento: '', telefono: '', email: '', direccion: ''
  };

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
        console.error("Error al cargar propietarios:", err);
        this.loading = false;
      }
    });
  }

  abrirModalCrear() {
    this.editando = false;
    this.propietarioForm = { nombres: '', apellidos: '', tipo_documento: 'CC', numero_documento: '', telefono: '', email: '', direccion: '' };
    this.mostrarModal = true;
  }

  abrirModalEditar(p: any) {
    this.editando = true;
    this.idSeleccionado = p.id_propietario;
    this.propietarioForm = { ...p };
    this.mostrarModal = true;
  }

  guardarPropietario() {
    if (this.editando && this.idSeleccionado) {
      this.propietarioService.actualizarPropietario(this.idSeleccionado, this.propietarioForm).subscribe(() => {
        this.cargarPropietarios();
        this.cerrarModal();
      });
    } else {
      this.propietarioService.crearPropietario(this.propietarioForm).subscribe(() => {
        this.cargarPropietarios();
        this.cerrarModal();
      });
    }
  }

  eliminarPropietario(id: number, nombre: string) {
    if (confirm(`¿Eliminar a ${nombre}?`)) {
      this.propietarioService.eliminarPropietario(id).subscribe(() => this.cargarPropietarios());
    }
  }

  cerrarModal() { this.mostrarModal = false; }
  volver() { this.router.navigate(['/dashboard']); }
}