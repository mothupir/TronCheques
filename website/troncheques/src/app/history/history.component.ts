import { Component } from '@angular/core';
import { Deposit, Response } from '../model/deposit.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepositService } from '../service/deposit/deposit.service';
import { SpinnerService } from '../service/spinner/spinner.service';
import { DatePipe } from '@angular/common';

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
    private messageService: MessageService,
    private spinner: SpinnerService,
    private datePipe: DatePipe
    ) {}

  ngOnInit() {
    
  }

  async getDeposits() {
    this.spinner.show();
    await this.depositService.getDeposits(0, 10).then(data => {
      console.log("Error:", data);
      this.response = data;
      this.spinner.hide();
    }).catch(error => {
      console.log("Error:", error);
      this.spinner.hide();
    })
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
  }

  showReverseConfirmationPopup(uuid: string, event:Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure you want to reverse the payment? \nNote. There will be a reversal charge.",
      header: "Reverse Deposit",
      accept: async () => {
        await this.reverse(uuid).then((data: boolean) => {
          data ? this.messageService.add({ severity: 'success', summary: 'Successful', detail: "Deposit has been successfully reversed. Funds are returned to depositor's wallet" }) :
          this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Failed to reverse funds.' });
        });
      }
    });
  }

  async reverse(uuid: string): Promise<boolean> {
    return false;
  }

  showViewDialog(uuid: string) {
    this.viewVisible = true;
  }
}
