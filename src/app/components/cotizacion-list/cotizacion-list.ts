import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CotizacionService } from '../../services/cotizacion.service';
import { Header } from '../../shared/components/header/header';
import { Alert } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-cotizacion-list',
  imports: [RouterLink, CurrencyPipe, DatePipe, Header, Alert],
  templateUrl: './cotizacion-list.html',
  styleUrl: './cotizacion-list.css',
})
export class CotizacionList {
  private cotizacionService = inject(CotizacionService);

  // Expone la lista de cotizaciones reactiva desde el servicio
  public cotizaciones = this.cotizacionService.cotizaciones;
}
