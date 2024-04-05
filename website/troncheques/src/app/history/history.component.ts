import { Component } from '@angular/core';
import { Payment, Payments } from '../model/deposit.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  activePayments: Payments = new Payments();
  inactivePayments: Payments = new Payments();
}
