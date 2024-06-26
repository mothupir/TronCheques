import { Component } from '@angular/core';
import { Deposit, Response } from '../model/deposit.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepositService } from '../service/deposit/deposit.service';
import { SpinnerService } from '../service/spinner/spinner.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  retries: number = 0;
  maxRetries: number = 2;

  viewVisible = false;

  response: Response = new Response();
  deposit: Deposit = new Deposit();

  count: number = 25;

  showBack: boolean = false;
  showNext: boolean = false;

  cache: Response[] = [];

  constructor(
    private depositService: DepositService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: SpinnerService,
    private datePipe: DatePipe,
    private client: HttpClient
    ) {}

  async ngOnInit() {
    await this.getDeposits();
    this.checkNextBack();
  }

  checkNextBack() {
    if (this.response.index > 0) {
      this.showNext = true;
    } else {
      this.showNext = false;
    }

    if (this.cache.length > 1) {
      this.showBack = true;
    } else {
      this.showBack = false;
    }
  }

  async getPrev() {
    let index = this.cache.length - 1;
    this.cache.splice(index, 1);
    this.response = this.cache[index - 1];

    this.checkNextBack();
  }

  async getNext() {
    await this.getDeposits().then((data) => {
      if (data) {
        this.cache.push(data);
      }
    });
  }

  async getDeposits(): Promise<Response> {
    this.spinner.show();
    let res!: Response;
    await this.depositService.getDeposits(this.response.index, this.count).then(data => {
      this.response = data;
      res = data;
      this.spinner.hide();
      this.checkNextBack();
      this.retries = 0;
    }).catch(async error => {
      if (this.retries <= this.maxRetries) {
        this.retries++;
        await this.depositService.delay(3000);
        console.log("retrying..");
        await this.getDeposits();
      } else {
        this.spinner.hide();
        this.retries = 0;
      }
    });
    
    return res;
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
      this.retries = 0;
    }).catch(async error => {
      if (this.retries <= this.maxRetries) {
        this.retries++;
        await this.depositService.delay(3000);
        console.log("retrying..");
        await this.reverse(uuid);
      } else {
        this.spinner.hide();
        this.messageService.add({ severity: 'warn', summary: 'Reversal Error', detail: error.error });
        this.retries = 0;
      }
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
        this.retries = 0;
      },
      async error => {
        if (this.retries <= this.maxRetries) {
          this.retries++;
          await this.depositService.delay(3000);
          console.log("retrying..");
          await this.showViewDialog(uuid);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Failed to update fees.', detail: `\n ${error.message}` });
          this.spinner.hide();
          this.retries = 0;
        }
      }
    );
  }
}
