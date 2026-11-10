import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductoPedido } from '../entidades/producto-pedido';

@Injectable({
    providedIn: 'root'
    })

export class CompartirDatosService {
    private platformId = inject(PLATFORM_ID);
    public pedidoSignal = signal<ProductoPedido[]>(this.obtenerPedidoInicial());

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
