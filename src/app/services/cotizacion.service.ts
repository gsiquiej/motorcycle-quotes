import { Injectable, signal } from '@angular/core';
import { Cotizacion } from '../models/cotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private readonly STORAGE_KEY = 'moto_prestamos_cotizaciones';

  // Signal mutable interno para almacenar las cotizaciones
  private _cotizaciones = signal<Cotizacion[]>(this.cargarDeLocalStorage());

  // Signal readonly expuesto para que los componentes lo consuman reactivamente
  public cotizaciones = this._cotizaciones.asReadonly();

  /**
   * Carga las cotizaciones almacenadas en LocalStorage
   */
  private cargarDeLocalStorage(): Cotizacion[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error cargando cotizaciones desde LocalStorage', error);
      return [];
    }
  }

  /**
   * Guarda la lista actual de cotizaciones en LocalStorage
   */
  private guardarEnLocalStorage(items: Cotizacion[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error guardando cotizaciones en LocalStorage', error);
    }
  }

  /**
   * Obtiene una cotización por su ID único
   */
  public obtenerPorId(id: string): Cotizacion | undefined {
    return this._cotizaciones().find(c => c.id === id);
  }

  /**
   * Calcula la cuota mensual proyectada utilizando el sistema francés de amortización.
   * Fórmula: M = P * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
   * Donde:
   * P = Monto solicitado (Principal)
   * i = Tasa mensual (Tasa Anual / 12 / 100)
   * n = Plazo en meses
   */
  public calcularCuota(monto: number, tasaAnual: number, plazoMeses: number): number {
    if (monto <= 0 || plazoMeses <= 0) {
      return 0;
    }

    // Tasa de interés mensual (i)
    const tasaMensual = (tasaAnual / 12) / 100;

    // Caso de tasa de interés 0%
    if (tasaMensual === 0) {
      return Number((monto / plazoMeses).toFixed(2));
    }

    // Aplicar fórmula del sistema francés
    const factor = Math.pow(1 + tasaMensual, plazoMeses);
    const cuota = (monto * tasaMensual * factor) / (factor - 1);

    // Redondear a dos decimales
    return Number(cuota.toFixed(2));
  }

  /**
   * Guarda una nueva cotización calculando la cuota automáticamente
   */
  public guardarCotizacion(
    datos: Omit<Cotizacion, 'id' | 'cuotaMensual' | 'fechaCreacion'>
  ): Cotizacion {
    const cuota = this.calcularCuota(
      datos.montoSolicitado,
      datos.tasaInteres,
      datos.plazoMeses
    );

    const nuevaCotizacion: Cotizacion = {
      ...datos,
      id: crypto.randomUUID(),
      cuotaMensual: cuota,
      fechaCreacion: new Date().toISOString()
    };

    // Actualizar el estado de manera inmutable
    this._cotizaciones.update(actuales => [nuevaCotizacion, ...actuales]);

    // Persistir cambios
    this.guardarEnLocalStorage(this._cotizaciones());

    return nuevaCotizacion;
  }
}
