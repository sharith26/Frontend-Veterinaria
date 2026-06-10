import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../services/mascota.service'; 

@Component({
  selector: 'app-mascota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mascota.component.html',
  styleUrls: ['./mascota.component.css']
})
export class MascotaComponent implements OnInit {
  mascotas: any[] = [];
  
  mascotaSeleccionada: any = null;
  medicamentosMascota: any[] = [];
  mostrarModalMedicamentos: boolean = false;
  cargandoMedicamentos: boolean = false;

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    this.obtenerTodasLasMascotas();
  }

  obtenerTodasLasMascotas() {
    this.mascotaService.obtenerMascotas().subscribe({
      next: (data: any[]) => {
        this.mascotas = data || [];
      },
      error: (err: any) => {
        console.error('Error al cargar la lista de mascotas:', err);
      }
    });
  }

  verMedicamentos(mascota: any) {
    this.mascotaSeleccionada = mascota;
    this.medicamentosMascota = [];
    this.cargandoMedicamentos = true;
    this.mostrarModalMedicamentos = true;

    this.mascotaService.obtenerMedicamentosPorMascota(mascota.id_mascota).subscribe({
      next: (data: any[]) => {
        this.medicamentosMascota = data || [];
        this.cargandoMedicamentos = false;
      },
      error: (err: any) => {
        console.error('Error al traer los medicamentos desde Express:', err);
        this.cargandoMedicamentos = false;
      }
    });
  }

  cerrarModal() {
    this.mostrarModalMedicamentos = false;
    this.mascotaSeleccionada = null;
    this.medicamentosMascota = [];
  }
}