import { Component } from '@angular/core';
import { Deposit, Response } from '../model/deposit.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepositService } from '../service/deposit/deposit.service';
import { SpinnerService } from '../service/spinner/spinner.service';
import { DatePipe } from '@angular/common';
import { findIndex } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

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
    private datePipe: DatePipe,
    private client: HttpClient
    ) {}

  ngOnInit() {
    
  }

  async getDeposits() {
    this.spinner.show();
    await this.depositService.getDeposits(0, 10).then(data => {
      this.response = data;
      this.spinner.hide();
    }).catch(error => {
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
        this.viewVisible = false;
        await this.reverse(uuid);
      }
    });
  }

  async reverse(uuid: string) {
    this.spinner.show();
    
    await this.depositService.reverse(uuid).then(() => {
      this.spinner.show();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: "Deposit has been successfully reversed. Funds are returned to depositor's wallet" });
    }).catch(error => {
      this.spinner.show();
      this.messageService.add({ severity: 'warn', summary: 'Reversal Error', detail: error.error });
    });
  }

  showViewDialog(uuid: string) {
    this.spinner.show();
    const i = this.response.deposits.findIndex(res => res.uuid == uuid);
    this.deposit = new Deposit();

    this.client.post(env.BASE_URL + 'password', { password: this.response.deposits[i].hash }).subscribe(
      (data: any) => {
        this.deposit.uuid = this.response.deposits[i].uuid;
        this.deposit.hash = data;
        this.deposit.amount = this.response.deposits[i].amount;
        this.deposit.fee = this.response.deposits[i].fee;
        this.deposit.ref = this.response.deposits[i].ref;
        this.deposit.owner = this.response.deposits[i].owner;
        this.deposit.withdrawn = this.response.deposits[i].withdrawn;
        this.deposit.reversed = this.response.deposits[i].reversed;
        this.deposit.blocked = this.response.deposits[i].blocked;
        this.deposit.withdrawer = this.response.deposits[i].withdrawer;
        this.deposit.timestamp = this.response.deposits[i].timestamp;
        this.deposit.active = this.response.deposits[i].active;
        this.viewVisible = true;
        this.spinner.hide();
      },
      error => {
        this.messageService.add({ severity: 'warn', summary: 'Error', detail: error.error });
        this.spinner.hide();
      }
    );
  }
}
