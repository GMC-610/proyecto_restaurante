import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Comidas } from '../entidades/comidas';
import { ProductoPedido } from '../entidades/producto-pedido';

@Injectable({
    providedIn: 'root'
    })

export class CompartirDatosService {
    private platformId = inject(PLATFORM_ID);
    public comidaSignal = signal<Comidas[]>(this.obtenerComidaInicial() || []);

    private obtenerComidaInicial() {
        
        if (isPlatformBrowser(this.platformId)) {
            const comidaGuardado = localStorage.getItem('comidaActual');
            return comidaGuardado ? JSON.parse(comidaGuardado) : null;
        }
        return null;
        }

        enviar(datosComidas: any[]) {
        console.log('Guardando comidas:', datosComidas);

        this.comidaSignal.set(datosComidas);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('comidaActual', JSON.stringify(datosComidas));
        }
        }


    limpiar() {
    this.comidaSignal.set([]);

    if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('comidaActual');
    }
    }



    public pedidoSignal = signal<ProductoPedido[]>(this.obtenerPedidoInicial());

// OBTENER PEDIDO GUARDADO
    private obtenerPedidoInicial(): ProductoPedido[] {
        if (isPlatformBrowser(this.platformId)) {
            const pedidoGuardado = localStorage.getItem('pedidoActual');
            if (pedidoGuardado) {
                let datos = JSON.parse(pedidoGuardado);
                return datos.map((item: any) =>
                    new ProductoPedido(
                        item.id,
                        item.tipo,
                        item.nombre,
                        item.imagen,
                        item.precio,
                        item.cantidad
                    )
                );
            }
        }
        return [];
    }


    enviarPedido(datos: ProductoPedido[]) {
        console.log('Productos enviados:', datos);
        this.pedidoSignal.set(datos);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('pedidoActual', JSON.stringify(datos));
        }
    }

    limpiarPedido() {
        this.pedidoSignal.set([]);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('pedidoActual');
        }
    }
    

    constructor() { }
}
