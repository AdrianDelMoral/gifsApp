import { Component } from '@angular/core';

import { GifsService } from '../../gifs/services/gifs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})

export class SidebarComponent {


  get historial() {
    return this.gifsService.historial;
  }

  // Injectar el servicio de gifs
  constructor(private gifsService: GifsService) { }

  buscar(termino: string) {
    // Para si le damos a una busqueda anterior, se cargue y cambie por la que esté actualmente o se cargue y muestre si no hay ninguna
    this.gifsService.buscarGifs(termino)

  }

}
