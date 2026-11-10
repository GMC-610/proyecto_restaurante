import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Comidas } from '../entidades/comidas';
import { Router } from '@angular/router';
import { CompartirDatosService } from '../servicios/compartir-datos.service';
import { ApiService } from '../servicios/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductoPedido } from '../entidades/producto-pedido';

@Component({
    selector: 'app-comidas',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './comidas.component.html',
    styleUrl: './comidas.component.css'
})

export class ComidasComponent implements OnInit {

    comidasOriginales: Comidas[] = [];
    nombreBusqueda: string = '';
    ingredienteBusqueda: string = '';
    comidas:  Comidas[] = [];

    preciosComidas: { [id: string]: number } = {};
    mostrarModal: boolean = false;

    private dataService = inject(CompartirDatosService);
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.preciosComidas = JSON.parse(
                localStorage.getItem('preciosComidas') || '{}'
            );
        }

        this.obtenerComidasIniciales();
    }

    constructor(private apiService: ApiService) {}


    obtenerComidasIniciales() {
        let categorias = ['Seafood', 'Chicken', 'Vegetarian', 'Dessert', 'Beef'];

        Promise.all(
            categorias.map(categoria =>
                this.apiService.mostrarDatosCC(categoria)
            )
        )
        .then(datos => {
            let resultados: any[] = [];
            datos.forEach(data => {
                resultados = resultados.concat((data.meals || []).slice(0, 12));
            });

            return Promise.all(
                resultados.map(item =>
                    this.apiService.mostrarDetalle(item.idMeal)
                )
            );
        })
        .then(datos => {
            this.comidas = datos
                .filter(item => item.meals)
                .map(item => this.convertirComida(item.meals[0]));
            this.comidasOriginales = [...this.comidas];
            console.log('Comidas iniciales:', this.comidas);
        })

        .catch(error => {
            console.error('Error al cargar las comidas:', error);
        });
    }
/*-----------------------------BUSQUEDA POR NOMBRE------------------------------------------*/

    obtenerDatosCN(nombre: string) {
        this.apiService.mostrarDatosCN(nombre)
            .then(data => {
                this.comidas = (data.meals || []).map((item: any) =>
                    this.convertirComida(item)
                );
                console.log('Comidas encontradas:', this.comidas);
        })
        .catch(error => console.error('Error al buscar comidas:', error));
    }

/*-----------------------------BUSQUEDA POR INGREDIENTE------------------------------------------*/

    obtenerDatosCI(ingrediente: string) {
        this.apiService.mostrarDatosCI(ingrediente)
        .then(data => {
            let resultados = data.meals || [];
            return Promise.all(
                resultados.map((item: any) =>
                    this.apiService.mostrarDetalle(item.idMeal)));
            })
        .then(datos => {
            this.comidas = datos
            .filter((item: any) => item.meals)
            .map((item: any) => this.convertirComida(item.meals[0]));
            console.log('Comidas obtenidas:', this.comidas);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    }

/*-----------------------------BUSQUEDA POR CATEGORIAS------------------------------------------*/
    filtrarCategoria(categoria: string) {
        if (categoria === 'Todos') {
            this.comidas = [...this.comidasOriginales];
        } else {
            this.apiService.mostrarDatosCC(categoria)
                .then(data => {
                    let resultados = data.meals || [];
                    return Promise.all(
                        resultados.map((item: any) =>
                            this.apiService.mostrarDetalle(item.idMeal)
                        )
                    );
                })
            .then(datos => {
                this.comidas = datos
                    .filter((item: any) => item.meals)
                    .map((item: any) =>
                        this.convertirComida(item.meals[0])
                    );
                console.log('Comidas por categoría:', this.comidas);
            })
            .catch(error => {
                console.error('Error al filtrar las comidas:', error);
            });
        }
    }
/*-----------------------------------------------------------------------*/
    convertirComida(datos: any): Comidas {
        let ingredientes: string[] = [];
        
        for (let i = 1; i <= 20; i++) {
            let ingrediente = datos['strIngredient' + i];

            if (ingrediente && ingrediente.trim() != '') {
            ingredientes.push(ingrediente);
            }
        }

        // Buscar si la comida ya tiene un precio guardado
        let precio = this.preciosComidas[datos.idMeal];

        // Si no existe, generar un precio aleatorio
        if (precio === undefined) {
            precio = Math.floor(Math.random() * 7) * 10000 + 10000;
            // Guardar el precio en el objeto
            this.preciosComidas[datos.idMeal] = precio;
            // Guardar todos los precios en localStorage
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(
                    'preciosComidas',
                    JSON.stringify(this.preciosComidas)
                );
            }
        }

        return new Comidas(
            datos.idMeal,
            datos.strMeal,
            datos.strMealThumb,
            datos.strCategory,
            ingredientes,
            precio
        );
        }

    aumentarCantidad(comida: Comidas) {
        comida.cantidad++;
    }

    disminuirCantidad(comida: Comidas) {
        if (comida.cantidad > 1) {
            comida.cantidad--;}
    }

    agregarAlPedido(comida: Comidas) {

        let producto = new ProductoPedido(
            comida.idMeal,
            'comida',
            comida.strMeal,
            comida.strMealThumb,
            comida.precio,
            comida.cantidad
        );

        let lista = [...this.dataService.pedidoSignal()];
        let existente = lista.find(item =>
            item.id === producto.id && item.tipo === producto.tipo
        );

        if (existente) {
            existente.cantidad += producto.cantidad;
        } else {
            lista.push(producto);
        }

        this.dataService.enviarPedido(lista);
            this.mostrarModal = true;
    }

    cerrarModal() {
        this.mostrarModal = false;
    }
}

