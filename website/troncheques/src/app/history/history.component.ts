import { Component } from '@angular/core';
import { Deposit, Response } from '../model/deposit.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepositService } from '../service/deposit/deposit.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  viewVisible = false;

  response: Response = new Response();
  deposit: Deposit = new Deposit();

  constructor(
    private depositService: DepositService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {}

  ngOnInit() {
    let deposit = new Deposit();
    deposit.active = true;
    deposit.ref = "Mothupi Mike Ramogayana";
    this.response.deposits.push(
      new Deposit(), 
      deposit, 
      new Deposit(),
      new Deposit(), 
      deposit, 
      new Deposit(),
      new Deposit(), 
      deposit, 
      new Deposit(),
      new Deposit(), 
      deposit, 
      new Deposit(),
      new Deposit(), 
      deposit, 
      new Deposit(),
      new Deposit(), 
      deposit, 
      new Deposit(),
    );
  }

  async getMyDeposits() {
    console.log('Owner: ', 'Hello');
  }

  showReverseConfirmationPopup(index: number, event:Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to reverse the payment? \nNote. There will be a reversal charge.",
      header: "Reverse Deposit",
      accept: async () => {
        await this.reverse(index).then((data: boolean) => {
          data ? this.messageService.add({ severity: 'success', summary: 'Successful', detail: "Deposit has been successfully reversed. Funds are returned to depositor's wallet" }) :
          this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Failed to reverse funds.' });
        });
      }
    });
  }

  async reverse(index: number): Promise<boolean> {
    return false;
  }

  showViewDialog(index: number) {
    this.viewVisible = true;
  }
}
