import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { CotizacionService } from '../../services/cotizacion.service';
import { Header } from '../../shared/components/header/header';
import { Alert } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-cotizacion-form',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, Header, Alert],
  templateUrl: './cotizacion-form.html',
  styleUrl: './cotizacion-form.css',
})
export class CotizacionForm {
  private fb = inject(FormBuilder);
  private cotizacionService = inject(CotizacionService);
  private router = inject(Router);

  // Señal para almacenar la cuota calculada en tiempo real
  public cuotaProyectada = signal<number>(0);

  // Señal para mostrar el mensaje de éxito temporal
  public mensajeExito = signal<string>('');

  // Formulario reactivo tipado con validaciones requeridas
  public form = this.fb.group({
    nombreCliente: ['', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]],
    montoSolicitado: [null as number | null, [
      Validators.required,
      Validators.min(0.01),
      Validators.max(60000)
    ]],
    tasaInteres: [null as number | null, [
      Validators.required,
      Validators.min(0),
      Validators.max(20)
    ]],
    plazoMeses: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(60),
      Validators.pattern(/^\d+$/)
    ]]
  });

  constructor() {
    // Escucha los cambios en los inputs para recalcular la cuota proyectada al instante
    this.form.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.calcularProyeccion();
    });
  }

  /**
   * Calcula de forma reactiva el pago mensual de amortización
   */
  private calcularProyeccion(): void {
    const { montoSolicitado, tasaInteres, plazoMeses } = this.form.value;
    if (
      this.form.valid &&
      typeof montoSolicitado === 'number' &&
      typeof tasaInteres === 'number' &&
      typeof plazoMeses === 'number'
    ) {
      const cuota = this.cotizacionService.calcularCuota(montoSolicitado, tasaInteres, plazoMeses);
      this.cuotaProyectada.set(cuota);
    } else {
      this.cuotaProyectada.set(0);
    }
  }

  /**
   * Guarda la cotización e inicia la redirección
   */
  public onSubmit(): void {
    if (this.form.valid) {
      const { nombreCliente, montoSolicitado, tasaInteres, plazoMeses } = this.form.value;

      if (
        nombreCliente &&
        typeof montoSolicitado === 'number' &&
        typeof tasaInteres === 'number' &&
        typeof plazoMeses === 'number'
      ) {
        this.cotizacionService.guardarCotizacion({
          nombreCliente,
          montoSolicitado,
          tasaInteres,
          plazoMeses
        });

        this.mensajeExito.set(`¡Cotización guardada exitosamente para ${nombreCliente}!`);
        this.form.reset();

        // Redirigir al listado principal tras un breve retraso
        setTimeout(() => {
          this.router.navigate(['/cotizaciones']);
        }, 1500);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
