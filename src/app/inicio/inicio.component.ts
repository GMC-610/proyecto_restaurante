import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent implements OnInit {

  imagenComida: string = '';
  imagenBebida: string = '';

  nombrePlato: string = '';
  nombreBebida: string = '';

  imagenesGaleria: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // OBTENER UN PLATO
    this.apiService.mostrarDatosCC('Seafood')
      .then(data => {

          this.imagenComida = data.meals[3].strMealThumb;
          this.nombrePlato = data.meals[3].strMeal;

          this.imagenesGaleria.push(
            ...data.meals.slice(0, 5).map((item: any) => item.strMealThumb)
          );
      });

    // OBTENER UNA BEBIDA
    this.apiService.mostrarDatosBC('Cocktail')
      .then(data => {

          this.imagenBebida = data.drinks[3].strDrinkThumb;
          this.nombreBebida = data.drinks[3].strDrink;

          this.imagenesGaleria.push(
            ...data.drinks.slice(2, 7).map((item: any) => item.strDrinkThumb)
          );
      });
  }
}
