export interface Cotizacion {
  id: string;
  nombreCliente: string;
  montoSolicitado: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  fechaCreacion: string;
}

export interface DetalleAmortizacion {
  numeroCuota: number;
  saldoPendiente: number;
  interes: number;
  capital: number;
  cuota: number;
}
