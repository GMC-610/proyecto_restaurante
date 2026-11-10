import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor() { }

/*---------------------------------------------BUSCAR COMIDA POR NOMBRE------------------------------------------ */
  private urlCN ="https://www.themealdb.com/api/json/v1/1/search.php?s="

  mostrarDatosCN(nombre: string){
    return fetch(this.urlCN + nombre)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    throw error;
  });
  }

/*---------------------------------------------BUSCAR COMIDA POR INGREDIENTE------------------------------------------ */
  
  private urlCI ="https://www.themealdb.com/api/json/v1/1/filter.php?i="
  mostrarDatosCI(ingrediente: string){
    return fetch(this.urlCI + ingrediente)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    throw error;
  });
  }

  private urlDetalle = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  mostrarDetalle(id: string) {
    return fetch(this.urlDetalle + id)
        .then(response => response.json());
  }
/*---------------------------------------------BUSCAR COMIDA POR CATEGORIA------------------------------------------ */
  private urlCC = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";

  mostrarDatosCC(categoria: string) {

      return fetch(this.urlCC + categoria)
          .then(response => response.json())
          .then(data => {
              return data;
          })
          .catch(error => {
              console.error('Error al obtener los datos:', error);
              throw error;
          });

  }
  /*---------------------------------------------BUSCAR BEBIDA POR NOMBRE------------------------------------------ */
  private urlBN ="https://www.thecocktaildb.com/api/json/v1/1/search.php?s="

  mostrarDatosBN(nombre: string){
    return fetch(this.urlBN + nombre)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data;
  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
    throw error;
  });
  }
  /*---------------------------------------------BUSCAR BEBIDA POR INGREDIENTE------------------------------------------ */

  private urlBL = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=";

  mostrarDatosBL(letra: string) {

      return fetch(this.urlBL + letra)
          .then(response => response.json())
          .then(data => {
              return data;
          })
          .catch(error => {
              console.error('Error al obtener las bebidas:', error);
              throw error;
          });

  }

  private urlDetalleB = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
  mostrarDetalleB(id: string) {
    return fetch(this.urlDetalleB + id)
        .then(response => response.json());
  }

  /*---------------------------------------------BUSCAR BEBIDA POR ALCOHOL------------------------------------------ */
  private urlBA = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=";

  mostrarDatosBA(tipo: string) {
      return fetch(this.urlBA + tipo)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              return data;
          })
          .catch(error => {
              console.error('Error al obtener las bebidas:', error);
              throw error;
          });

  }

/*---------------------------------------------BUSCAR BEBIDAS POR CATEGORÍA------------------------------------------ */
  private urlBC = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=";

  mostrarDatosBC(categoria: string) {
      return fetch(this.urlBC + categoria)
          .then(response => response.json())
          .then(data => {
              return data;
          })
          .catch(error => {
              console.error('Error al obtener los datos:', error);
              throw error;
          });

  }
}
