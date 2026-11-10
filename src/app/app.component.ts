import { Component,inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { filter } from 'rxjs';
import { InicioComponent } from "./inicio/inicio.component";
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/*RouterOutlet,*/ NavegacionComponent, InicioComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto_restaurante';

  private router = inject(Router);
  esRutaInicio = true;

  constructor() {
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
    
        this.esRutaInicio = event.urlAfterRedirects === '/' ;
      });
  }
}
