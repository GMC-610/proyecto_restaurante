import { Cliente } from './cliente';
import { ProductoPedido } from './producto-pedido';

export class Pedido {

    cliente: Cliente;
    tipoEntrega: string = '';
    fecha: Date = new Date();
    productos: ProductoPedido[] = [];

    constructor(
        cliente: Cliente,
        tipoEntrega: string,
        productos: ProductoPedido[]
    ) {
        this.cliente = cliente;
        this.tipoEntrega = tipoEntrega;
        this.productos = productos;
    }

    cantidadTotal(): number {
        let total = 0;
        this.productos.forEach(producto => {
            total += producto.cantidad;
        });

        return total;
    }

    calcularTotal(): number {
        let total = 0;
        this.productos.forEach(producto => {
            total += producto.calcularSubtotal();
        });
        return total;
    }
}
