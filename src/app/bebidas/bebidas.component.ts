import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { Bebidas } from '../entidades/bebidas';
import { CompartirDatosService } from '../servicios/compartir-datos.service';
import { ApiService } from '../servicios/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductoPedido } from '../entidades/producto-pedido';

@Component({
    selector: 'app-bebidas',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './bebidas.component.html',
    styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

    bebidasOriginales: Bebidas[] = [];
    nombreBusquedaB: string = '';
    ingredienteBusquedaB: string = '';
    bebidas:  Bebidas[] = [];
    tipoSeleccionado: string = '';

    preciosBebidas: { [id: string]: number } = {};
    mostrarModal: boolean = false;

    private dataService = inject(CompartirDatosService);
    private platformId = inject(PLATFORM_ID);
    
    ngOnInit(): void {

        if (isPlatformBrowser(this.platformId)) {
            this.preciosBebidas = JSON.parse(
                localStorage.getItem('preciosBebidas') || '{}'
            );
        }
        this.obtenerBebidasIniciales();
    }

    constructor(private apiService: ApiService) {}

// CARGAR bebidas INICIALES
    obtenerBebidasIniciales() {
        let categorias = ['Ordinary Drink', 'Cocoa', 'Cocktail', 'Shot', 'Soft Drink'];

        Promise.all(
            categorias.map(categoria =>
                this.apiService.mostrarDatosBC(categoria)
            )
        )
        .then(dato => {
            let resultados: any[] = [];
            dato.forEach(data => {
                resultados = resultados.concat((data.drinks || []).slice(0, 7));
            });

            return Promise.all(
                resultados.map(item =>
                    this.apiService.mostrarDetalleB(item.idDrink))
            );
        })
        .then(dato => {
            this.bebidas = dato
                .filter(item => item.drinks)
                .map(item => this.convertirBebidas(item.drinks[0]));
            this.bebidasOriginales = [...this.bebidas];
            console.log('Bebidas iniciales:', this.bebidas);
        })
        .catch(error => {
            console.error('Error al cargar las bebidas:', error);
        });
    }

/*-----------------------------BUSQUEDA POR NOMBRE------------------------------------------*/
    obtenerDatosBN(nombre: string) {
        this.apiService.mostrarDatosBN(nombre)
        .then(data => {
            this.bebidas = (data.drinks || []).map((item: any) =>
                this.convertirBebidas(item));
            console.log('Lista de objetos bebidas:', this.bebidas);
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    }

/*-----------------------------BUSQUEDA POR INGREDIENTE------------------------------------------*/

    obtenerDatosBI(ingrediente: string) {
        let letras = 'abcdefghijklmnopqrstuvwxyz'.split('');
        Promise.all(
            letras.map(letra =>
                this.apiService.mostrarDatosBL(letra))
        )

        .then(datos => {
            let resultados: any[] = [];
            datos.forEach(data => {
                resultados = resultados.concat(data.drinks || []);
            });
            // BUSCAR EL INGREDIENTE
            let bebidasEncontradas = resultados.filter((item: any) => {
                for (let i = 1; i <= 15; i++) {
                    let nombreIngrediente = item['strIngredient' + i];
                    if (nombreIngrediente &&
                        nombreIngrediente.trim().toLowerCase() === ingrediente.trim().toLowerCase()) {
                        return true;
                    }
                }
                return false;
            });

            // CONVERTIR A OBJETOS BEBIDAS
            this.bebidas = bebidasEncontradas.map((item: any) =>
                this.convertirBebidas(item)
            );
            console.log('Bebidas:', this.bebidas);
        })
        .catch(error => {
            console.error('Error al buscar bebidas:', error);
        });
    }

    /*-----------------------------BUSQUEDA POR ALCOHOL------------------------------------------*/

    obtenerDatosBA(tipo: string) {
        this.apiService.mostrarDatosBA(tipo)
            .then(data => {
                console.log('Datos obtenidos:', data);
                let resultados = (data.drinks || []).slice(0, 36);
                return Promise.all(
                    resultados.map((item: any) =>
                        this.apiService.mostrarDetalleB(item.idDrink))
                );
            })

            .then(data => {
                this.bebidas = data
                    .filter(item => item.drinks)
                    .map(item => this.convertirBebidas(item.drinks[0]));
                console.log('Lista de bebidas:', this.bebidas);

            })

            .catch(error => {
                console.error('Error al buscar bebidas:', error);
            });
    }

/*-----------------------------BUSQUEDA POR CATEGORÍA------------------------------------------*/

    obtenerDatosBC(categoria: string) {

        this.apiService.mostrarDatosBC(categoria)
            .then(data => {
                this.bebidas = (data.drinks || []).map((item: any) =>
                    this.convertirBebidas(item)
                );
                this.bebidasOriginales = [...this.bebidas];
                console.log('Bebidas por categoría:', this.bebidas);
            })
            .catch(error => {
                console.error('Error al buscar bebidas:', error);
            });
    }
/*-----------------------------------------------------------------------*/
    convertirBebidas(dato: any): Bebidas {
        let ingredientesB: string[] = [];
        for (let i = 1; i <= 20; i++) {
            let ingrediente = dato['strIngredient' + i];
            if (ingrediente && ingrediente.trim() != '') {
                ingredientesB.push(ingrediente);
            }
        }

        // Buscar si la comida ya tiene un precio guardado
        let precio = this.preciosBebidas[dato.idDrink];
        // Si no existe, generar un precio aleatorio
        if (precio === undefined) {
            precio = Math.floor(Math.random() * 7) * 10000 + 10000;
            // Guardar el precio en el objeto
            this.preciosBebidas[dato.idDrink] = precio;
            // Guardar todos los precios en localStorage
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(
                    'preciosBebidas',
                    JSON.stringify(this.preciosBebidas)
                );
            }
        }

        return new Bebidas(
            dato.idDrink,
            dato.strDrink,
            dato.strDrinkThumb,
            dato.strCategory,
            dato.strAlcoholic,
            ingredientesB,
            precio
        );
    }


/*-----------------------------------------------------------------------*/
    aumentarCantidad(bebida: Bebidas) {
        bebida.cantidad++;
    }

    disminuirCantidad(bebida: Bebidas) {
        if (bebida.cantidad > 1) {
            bebida.cantidad--;
        }
    }

    agregarAlPedido(bebida: Bebidas) {

        let producto = new ProductoPedido(
            bebida.idDrink,
            'bebida',
            bebida.strDrink,
            bebida.strDrinkThumb,
            bebida.precio,
            bebida.cantidad
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
