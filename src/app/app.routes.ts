import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cotizaciones',
    loadComponent: () => import('./components/cotizacion-list/cotizacion-list').then(m => m.CotizacionList)
  },
  {
    path: 'nueva-cotizacion',
    loadComponent: () => import('./components/cotizacion-form/cotizacion-form').then(m => m.CotizacionForm)
  },
  {
    path: 'detalle/:id',
    loadComponent: () => import('./components/cotizacion-detail/cotizacion-detail').then(m => m.CotizacionDetail)
  },
  {
    path: '',
    redirectTo: 'cotizaciones',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'cotizaciones'
  }
];
