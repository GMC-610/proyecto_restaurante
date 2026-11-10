export class Cliente {

    nombreCompleto: string = '';
    celular: string = '';
    direccion: string = '';

    constructor(
        nombreCompleto: string,
        celular: string,
        direccion: string
    ) {
        this.nombreCompleto = nombreCompleto;
        this.celular = celular;
        this.direccion = direccion;
    }
}