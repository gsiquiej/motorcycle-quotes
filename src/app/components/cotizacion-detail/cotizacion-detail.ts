import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CotizacionService } from '../../services/cotizacion.service';
import { Cotizacion, DetalleAmortizacion } from '../../models/cotizacion.model';
import { Header } from '../../shared/components/header/header';
import { Alert } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-cotizacion-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, Header, Alert],
  templateUrl: './cotizacion-detail.html',
  styleUrl: './cotizacion-detail.css',
})
export class CotizacionDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private cotizacionService = inject(CotizacionService);

  // Signal que contendrá la cotización buscada
  public cotizacion = signal<Cotizacion | undefined>(undefined);

  // Tabla con la proyección de amortización mensual
  public tablaAmortizacion = signal<DetalleAmortizacion[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const encontrada = this.cotizacionService.obtenerPorId(id);
      if (encontrada) {
        this.cotizacion.set(encontrada);
        this.generarTablaAmortizacion(encontrada);
      }
    }
  }

  /**
   * Genera el desglose del plan de pagos mes a mes (Método del Sistema Francés)
   */
  private generarTablaAmortizacion(c: Cotizacion): void {
    const tasaMensual = (c.tasaInteres / 12) / 100;
    let saldo = c.montoSolicitado;
    const cuota = c.cuotaMensual;
    const desglose: DetalleAmortizacion[] = [];

    for (let mes = 1; mes <= c.plazoMeses; mes++) {
      const interesMes = Number((saldo * tasaMensual).toFixed(2));
      let capitalMes = Number((cuota - interesMes).toFixed(2));

      // Ajuste para la última cuota para evitar diferencias por redondeo
      if (mes === c.plazoMeses) {
        capitalMes = Number(saldo.toFixed(2));
      }

      saldo = Number((saldo - capitalMes).toFixed(2));
      if (saldo < 0) saldo = 0;

      desglose.push({
        numeroCuota: mes,
        saldoPendiente: Number(saldo.toFixed(2)),
        interes: interesMes,
        capital: capitalMes,
        cuota: Number((capitalMes + interesMes).toFixed(2))
      });
    }

    this.tablaAmortizacion.set(desglose);
  }
}
