export class ProductoPedido {

    id: string = '';
    tipo: string = '';
    nombre: string = '';
    imagen: string = '';
    precio: number = 0;
    cantidad: number = 1;

    constructor(
        id: string,
        tipo: string,
        nombre: string,
        imagen: string,
        precio: number,
        cantidad: number
    ) {
        this.id = id;
        this.tipo = tipo;
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    calcularSubtotal(): number {
        return this.precio * this.cantidad;
    }
}