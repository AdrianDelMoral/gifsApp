import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'eEJxevZP5KfXUrOEhLWQEwgxO4TqI8sy';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  // solo lo voy a usar aqui
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  // Constructor para hacer peticiones http GET / OUT / POST.... Va a trabajar en base a 'Observables': mas control que una promise
  constructor(private http: HttpClient) {
    // Al haber añadido el localstorage, esto se usará una vez sea llamado, trabaja como un singleton:
    // Cargará del LocalStorage ya que lo hace solo una vez
    // Hay que indicar al resetear la pagina en las busquedas realizadas que no se borren, se haria de la siguiente forma:

    // Lo siguiente, es equivalente a lo que ha quedado como descomentado: 
    //    if (localStorage.getItem('historialBusquedas')) {
    //       this._historial = JSON.parse(localStorage.getItem('historialBusquedas')!);
    //    }

    /** 
     * indicamos que al recargar la página, parsearemos el item de localStorage llamado historialBusquedas, 
     * y como se que es un array, sea vacio / null o no, 
     * lo guarde en el array "_historial" y no pete de ninguna de las dos formas
     */
    // Almacenar en localStorage los resultados del historial de busqueda
    this._historial = JSON.parse(localStorage.getItem('historialBusquedas')!) || [];

    // Almacenar en localStorage los resultados de la última busqueda
    this.resultados = JSON.parse(localStorage.getItem('resultadosUltimaBusqueda')!) || [];
  }

  // siempre tendrá que tener un valor
  buscarGifs(query: string = '') {
    // Lo que llega, se modificará a minusculas todo y juntará
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      //primero lo inserto
      this._historial.unshift(query);

      // cortará el array principal si se inserta uno nuevo, ya que mostrará solo 15
      this._historial = this._historial.splice(0, 15);


      // Para poder mostrar después al recargar la página, le ponemos un nombre unico, para asi poder usarlo después al usar localStorage mas arriba en el constructor HttpClient

      // console.log(this._historial);
      localStorage.setItem('historialBusquedas', JSON.stringify(this._historial)); // se usa el metodo JSON.stringify, para asi poder usar cualquier objeto y convertirlo a stringify
    }

    /** 
     * Si queremos que que en vsCode sea mas organizada la peticion, 
     * y separarla por variables los parametros se harán de la siguiente forma:
    */
    const params = new HttpParams()
      .set('apiKey', this.apiKey) // la clave de la api
      .set('limit', '20') // el limite de resultados
      .set('q', query); // la palabra que estamos buscando

    // console.log(params.toString());

    // Especificamos la interfaz, que hemos guardado, de quicktype.io, y será el tipado, que es la primera
    //    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=eEJxevZP5KfXUrOEhLWQEwgxO4TqI8sy&q=${query}&limit=20`)
    
    // Con parametros definidos y mas ordenador: servicioUrl/EndPoint_Que_quiero_llamar/
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })


      /* Se puede poner el tipo de respuesta que va a recibir:
        * .subscribe((resp:any) => {}
        * .subscribe( resp => {}
      */
      // para saber que tipado debemos hacer: mirarlo en postman
      // para saber que tipado tenemos: mirar la respuesta, copiarlo y ir a la pagina web: quicktype.io
      .subscribe((resp) => {
        // console.log(resp.data);
        this.resultados = resp.data;
        // localStorage.setItem('resultadosUltimaBusqueda', JSON.stringify(this.resultados)); // sacaria todos los resultados sin distingir o filtrar

        // Para sacar unos datos en concretos se haria de esta forma
        localStorage.setItem('resultadosUltimaBusqueda', JSON.stringify(this.resultados));
      })

  }
}
