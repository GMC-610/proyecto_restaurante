export class Comidas {
    idMeal: string = '';
    strMeal: string = '';
    strMealThumb : string = '';
    strCategory: string = '';
    Ingredient: string[] = [];
    precio: number = 0;
    cantidad: number = 1;

    constructor(
        idMeal: string,
        strMeal: string,
        strMealThumb: string,
        strCategory: string,
        Ingredient: string[],
        precio: number
    ) {
        this.idMeal = idMeal;
        this.strMeal = strMeal;
        this.strMealThumb = strMealThumb;
        this.strCategory = strCategory;
        this.Ingredient = Ingredient;
        this.precio = precio;
    }
}
