import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CompartirDatosService } from '../servicios/compartir-datos.service';
import { Cliente } from '../entidades/cliente';
import { Pedido } from '../entidades/pedidos';
import { ProductoPedido } from '../entidades/producto-pedido';

import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.css'
})
export class PedidosComponent {

    dataService = inject(CompartirDatosService);

    nombreCompleto: string = '';
    celular: string = '';
    direccion: string = '';

    tipoEntrega: string = '';

    pedidoActual: Pedido | null = null;
    pdfGenerado: boolean = false;


    cantidadTotal(): number {
        let total = 0;
        this.dataService.pedidoSignal().forEach(producto => {
            total += producto.cantidad;
        });
        return total;
    }


    calcularTotal(): number {
        let total = 0;

        this.dataService.pedidoSignal().forEach(producto => {
            total += producto.calcularSubtotal();
            });

        return total;
    }


    async realizarPedido() {
        if (this.dataService.pedidoSignal().length === 0) {
            alert('No tienes productos en tu pedido.');
            return;
        }

        if (this.nombreCompleto.trim() === '') {
            alert('Por favor, ingresa tu nombre completo.');
            return;
        }

        if (this.celular.trim() === '') {
            alert('Por favor, ingresa tu número de celular.');
            return;
        }

        if (this.tipoEntrega === '') {
            alert('Por favor, selecciona el tipo de entrega.');
            return;
        }

        if (this.tipoEntrega === 'domicilio' && this.direccion.trim() === '') {
            alert('Por favor, ingresa tu dirección.');
            return;
        }

        const cliente = new Cliente(
            this.nombreCompleto,
            this.celular,
            this.tipoEntrega === 'domicilio' ? this.direccion : ''
        );

        this.pedidoActual = new Pedido(
            cliente,
            this.tipoEntrega,
            this.dataService.pedidoSignal()
        );

        console.log('Pedido realizado:', this.pedidoActual);

        await this.generarPDF();
    }

    eliminarProducto(producto: ProductoPedido) {
        let productosActualizados = this.dataService.pedidoSignal().filter(item =>
            !(item.id === producto.id && item.tipo === producto.tipo)
        );
        this.dataService.enviarPedido(productosActualizados);
    }

    obtenerLogo(): Promise<string> {
        return new Promise((resolve, reject) => {
            const imagen = new Image();
            imagen.src = '/assets/images/logo_manila.png';

            imagen.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = imagen.width;
                canvas.height = imagen.height;

                const contexto = canvas.getContext('2d');

                if (contexto) {
                    contexto.drawImage(imagen, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    reject('No se pudo cargar el logo');
                }
            };
            imagen.onerror = () => reject('No se encontró el logo');
        });
    }

    async generarPDF() {
        if (this.pedidoActual === null) return;

        const logo = await this.obtenerLogo();
        const doc = new jsPDF();
        doc.setFillColor(38, 63, 80);
        doc.rect(0, 0, 210, 45, 'F');

        doc.addImage(logo, 'PNG', 85, 3, 40, 25);

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('MANILA', 105, 35, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('COMPROBANTE DE PEDIDO', 105, 40, { align: 'center' });


        doc.setTextColor(0, 0, 0);
        doc.setFontSize(15);

        doc.text(
            'Fecha: ' + this.pedidoActual.fecha.toLocaleDateString('es-CO'),
            15,
            50
        );

        doc.setFontSize(13);
        doc.setTextColor(38, 63, 80);
        doc.text('DATOS DEL CLIENTE', 15, 65);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        doc.text(
            'Nombre: ' + this.pedidoActual.cliente.nombreCompleto,
            15,
            75
        );

        doc.text(
            'Celular: ' + this.pedidoActual.cliente.celular,
            15,
            83
        );

        doc.text(
            'Tipo de entrega: ' + this.pedidoActual.tipoEntrega,
            15,
            91
        );

        if (this.pedidoActual.tipoEntrega === 'domicilio') {
            doc.text(
                'Dirección de entrega: ' + this.pedidoActual.cliente.direccion,
                15,
                99
            );
        } else {

            doc.text(
                'Dirección del restaurante: Jl. Pantai Seminyak No. 25, Bali, Indonesia.',
                15,
                99
            );
        }

        let productos = this.pedidoActual.productos.map(producto => [
            producto.tipo,
            producto.nombre,
            producto.cantidad.toString(),
            '$ ' + producto.precio.toLocaleString('es-CO'),
            '$ ' + producto.calcularSubtotal().toLocaleString('es-CO')
        ]);

        autoTable(doc, {
            startY: this.pedidoActual.tipoEntrega === 'domicilio' ? 110 : 102,
            head: [[
                'Tipo',
                'Producto',
                'Cantidad',
                'Precio',
                'Subtotal'
            ]],
            body: productos,
            theme: 'grid',
            headStyles: {
                fillColor: [38, 63, 80]
            }
        });

        const posicionFinal = (doc as any).lastAutoTable.finalY + 15;

        doc.setFontSize(13);
        doc.setTextColor(38, 63, 80);

        doc.text(
            'TOTAL A PAGAR: $ ' + this.pedidoActual.calcularTotal().toLocaleString('es-CO'),
            195,
            posicionFinal,
            { align: 'right' }
        );

        doc.save('Pedido_MANILA.pdf');

        this.pdfGenerado = true;
    }

    limpiarPedido() {
        this.dataService.enviarPedido([]);

        this.nombreCompleto = '';
        this.celular = '';
        this.direccion = '';
        this.tipoEntrega = '';

        this.pedidoActual = null;

        this.pdfGenerado = false;
    }
}
