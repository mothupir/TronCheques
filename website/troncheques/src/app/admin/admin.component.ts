import { Component } from '@angular/core';
import { DepositService } from '../service/deposit/deposit.service';
import { Fee, Deposit, Response, Statistic } from '../model/deposit.model';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { SpinnerService } from '../service/spinner/spinner.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

interface SearchCriterion {
  code: string,
  name: string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  retries: number = 0;
  maxRetries: number = 2;

  fee: Fee = new Fee();
  fees: Fee[] = [];

  min: number = 0;
  max: number = 0;

  statistics: Statistic = new Statistic();

  searchCriterion!: SearchCriterion;
  searchValue = ""
  searchCriteria: SearchCriterion[] = [
    { code: "uuid", name: "Withdraw ID" },
    { code: "owner", name: "Depositor Address" }
  ];

  response: Response = new Response();
  deposit: Deposit = new Deposit();

  addEditVisible = false;
  viewVisible = false;

  constructor(
    private depositService: DepositService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: SpinnerService,
    private client: HttpClient
    ) {}

  async ngOnInit() {
    await this.getStatistics();
    await this.getTransactionalFees();
  }

  // Statistics
  async getStatistics() {
    this.spinner.show();
    this.client.get<Statistic>(env.BASE_URL + 'statistic').subscribe(
      data => {
        this.statistics = data;
        this.spinner.hide();
        this.retries = 0;
      },
      async error => {
        if (this.retries <= this.maxRetries) {
          this.retries++;
          await this.depositService.delay(3000);
          console.log("retrying..");
          await this.getStatistics();
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Error getting statistics.', detail: `\n ${error.message}` });
          this.spinner.hide();
          this.retries = 0;
        }
      }
    );
  }

  // Fees
  async getTransactionalFees() {
    this.spinner.show();
    this.client.get<Fee[]>(env.BASE_URL + 'fees/all').subscribe(
      data => {
        this.fees = data;
        this.spinner.hide();
        this.min = this.fees[0].min;
        this.max = this.fees[this.fees.length - 1].deposit
        this.retries = 0;
      },
      async error => {
        if (this.retries <= this.maxRetries) {
          this.retries++;
          await this.depositService.delay(3000);
          console.log("retrying..");
          await this.getTransactionalFees();
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Error getting fees.', detail: `\n ${error.message}` });
          this.spinner.hide();
          this.retries = 0;
        }
      }
    );
  }

  async updateFees() {
    this.spinner.show();
    this.client.post(env.BASE_URL + 'fees', this.fees).subscribe(
      data => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Fees updated successfully.' });
        this.spinner.hide();
        this.retries = 0;
      },
      async error => {
        if (this.retries <= this.maxRetries) {
          this.retries++;
          await this.depositService.delay(3000);
          console.log("retrying..");
          await this.updateFees();
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Failed to update fees.', detail: `\n ${error.message}` });
          this.spinner.hide();
          this.retries = 0;
        }
      }
    );
  }

  showAddEditFeeDialog(id: number) {
    if (id < 0) {
      this.fee.id = this.fees.length > 0 ?Math.max(...this.fees.map(f => f.id)) + 1 : 0;
      this.fee.min = 0;
      this.fee.max = 0;
      this.fee.deposit = 0;
      this.fee.reversal = 0;
    } else {
      let index = this.fees.findIndex((f: any) => f.id == id);
      if (index > -1) {
        this.fee.id = this.fees[index].id;
        this.fee.min = this.fees[index].min;
        this.fee.max = this.fees[index].max;
        this.fee.deposit = this.fees[index].deposit;
        this.fee.reversal = this.fees[index].reversal;
      }
    }
    this.addEditVisible = true;
  }

  addEditFee(id: number) {
    let index = this.fees.findIndex((f: any) => f.id == id);
    if (index > -1) {
      this.fees[index] = this.fee;
    } else {
      this.fees.push(new Fee(this.fee));
    }
    this.addEditVisible = false;
  }

  removeFee(id: number) {
    let index = this.fees.findIndex((f: any) => f.id == id);
    if (index > -1) {
      this.fees.splice(index, 1);
    }
  }

  clearFee() {
    this.fee.min = 0;
    this.fee.max = 0;
    this.fee.deposit = 0;
    this.fee.reversal = 0;
  }

  // Search
  async search() {
    if (!this.searchCriterion) return;

    switch(this.searchCriterion.code) {
      case 'index':
        await this.getDeposit();
        break;
      case 'owner':
        await this.getMyDeposits();
        break;
    }S
  }

  async getDeposit() {
    console.log('Index: ', this.searchValue);
  }

  async getMyDeposits() {
    console.log('Owner: ', this.searchValue);
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
