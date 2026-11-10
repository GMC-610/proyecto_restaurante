import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../servicios/api.service';

@Component({
    selector: 'app-juego',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './juego.component.html',
    styleUrl: './juego.component.css'
})

export class JuegoComponent implements OnInit {
    constructor(private apiService: ApiService) {}

    intentos: number = 0;
    juegoTerminado: boolean = false;

    imagenComida: string = '';
    imagenBebida: string = '';

    cartas: any[] = [];

    ngOnInit(): void {
        Promise.all([
            this.apiService.mostrarDetalle('53138'),
            this.apiService.mostrarDetalleB('17135')
        ])
        .then(data => {
            this.imagenComida = data[0].meals[0].strMealThumb;
            this.imagenBebida = data[1].drinks[0].strDrinkThumb;
            this.iniciarJuego();
        });

    }


    iniciarJuego() {
        this.cartas = [];
        this.intentos = 0;
        this.juegoTerminado = false;

        this.cartas.push({
            tipo: 'comida',
            imagen: this.imagenComida,
            encontrada: false
        });

        this.cartas.push({
            tipo: 'bebida',
            imagen: this.imagenBebida,
            encontrada: false
        });

        for (let i = 0; i < 14; i++) {
            this.cartas.push({
                tipo: 'x',
                imagen: '',
                encontrada: false
            });
        }
        this.cartas.sort(() => Math.random() - 0.5);
    }


    seleccionarCarta(carta: any) {
        if (carta.encontrada || this.juegoTerminado) {
            return;
        }

        this.intentos++;
        carta.encontrada = true;

        if (this.cartas.filter(item =>
            item.encontrada &&
            (item.tipo === 'comida' || item.tipo === 'bebida')
        ).length === 2) {
        this.juegoTerminado = true;
        }
    }

    cerrarModal() {
        this.juegoTerminado = false;
    }
}
