import { Component, ViewChild, ElementRef } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
})
export class BusquedaComponent {

  //@ViewChild es un decorador para obtener datos de la página mediante referencia
  // El signo '!' es que estoy seguro que nunca será nulo
  // HTMLInputElement: es de tipo genérico Input
  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>;

  // Injectar el servicio de gifs
  constructor(private gifsService: GifsService) { }

  buscar() {

    const valor = this.txtBuscar.nativeElement.value;
    // No se pueden buscar vacios
    if (valor.trim().length === 0) {
      return;
    }

    this.gifsService.buscarGifs(valor);

    // Resetear el buscador a vacio:
    this.txtBuscar.nativeElement.value = '';

  }
}
