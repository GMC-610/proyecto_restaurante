export class Bebidas {

    idDrink: string = '';
    strDrink: string = '';
    strDrinkThumb: string = '';
    strCategory: string = '';
    strAlcoholic: string = '';
    Ingredient: string[] = [];
    precio: number = 0;
    cantidad: number = 1;

    constructor(
        idDrink: string,
        strDrink: string,
        strDrinkThumb: string,
        strCategory: string,
        strAlcoholic: string,
        Ingredient: string[],
        precio: number
    ) {

        this.idDrink = idDrink;
        this.strDrink = strDrink;
        this.strDrinkThumb = strDrinkThumb;
        this.strCategory = strCategory;
        this.strAlcoholic = strAlcoholic;
        this.Ingredient = Ingredient;
        this.precio = precio;
    }
}
