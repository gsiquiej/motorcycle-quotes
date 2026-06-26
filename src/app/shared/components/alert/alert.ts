import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {
  mensaje = input.required<string>();
  tipo = input<'success' | 'error' | 'info' | 'warning'>('info');
}
