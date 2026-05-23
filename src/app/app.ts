import { Component } from '@angular/core'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>` // Asegura el renderizado de las rutas
})
export class AppComponent {
  title = 'frontend-veterinaria';
}