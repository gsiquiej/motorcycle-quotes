import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CotizacionService } from './cotizacion.service';

describe('CotizacionService', () => {
  let service: CotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotizacionService);
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calcularCuota', () => {
    it('debería calcular la cuota mensual correctamente utilizando el sistema francés', () => {
      // P = Q15,000, Tasa Anual = 12% (1% mensual), Plazo = 24 meses
      // M = 15000 * (0.01 * (1.01)^24) / ((1.01)^24 - 1) = Q706.10
      const cuota = service.calcularCuota(15000, 12, 24);
      expect(cuota).toBe(706.10);
    });

    it('debería calcular la cuota de forma simple si la tasa de interés es 0%', () => {
      // P = Q12,000, Tasa Anual = 0%, Plazo = 12 meses
      // M = 12000 / 12 = Q1000
      const cuota = service.calcularCuota(12000, 0, 12);
      expect(cuota).toBe(1000);
    });

    it('debería retornar 0 si el monto solicitado es menor o igual a 0', () => {
      const cuota = service.calcularCuota(0, 10, 12);
      expect(cuota).toBe(0);
    });

    it('debería retornar 0 si el plazo en meses es menor o igual a 0', () => {
      const cuota = service.calcularCuota(10000, 10, 0);
      expect(cuota).toBe(0);
    });
  });

  describe('guardarCotizacion', () => {
    it('debería registrar una nueva cotización y añadirla al signal reactivo', () => {
      const datos = {
        nombreCliente: 'Carlos Ruiz',
        montoSolicitado: 10000,
        tasaInteres: 10,
        plazoMeses: 12
      };

      const guardada = service.guardarCotizacion(datos);
      
      expect(guardada.id).toBeDefined();
      expect(guardada.cuotaMensual).toBeGreaterThan(0);
      expect(guardada.fechaCreacion).toBeDefined();

      // Verificar que el signal se actualizó
      const lista = service.cotizaciones();
      expect(lista.length).toBe(1);
      expect(lista[0].nombreCliente).toBe('Carlos Ruiz');
    });
  });
});
