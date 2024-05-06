import { Component } from '@angular/core';
import { DepositService } from '../service/deposit/deposit.service';
import { Fee, Deposit, Response, Statistic } from '../model/deposit.model';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { SpinnerService } from '../service/spinner/spinner.service';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { DatePipe } from '@angular/common';

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
  address: string = "";

  addEditVisible = false;
  viewVisible = false;

  count: number = 3;

  showBack: boolean = false;
  showNext: boolean = false;

  cache: Response[] = [];

  constructor(
    private depositService: DepositService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: SpinnerService,
    private client: HttpClient,
    private datePipe: DatePipe
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
      case 'uuid':
        await this.getDeposit();
        break;
      case 'owner':
        await this.getMyDeposits();
        break;
    }
  }

  async getDeposit() {
    this.spinner.show();
    let res!: Response;
    await this.depositService.getDeposit(this.searchValue).then((data) => {
      res = new Response();
      res.deposits.push(data);
      this.retries = 0;
      this.response = res;
      console.log("Deposit:", res);
      this.spinner.hide();
    }).catch(async error => {
      if (this.retries <= this.maxRetries) {
        this.retries++;
        await this.depositService.delay(3000);
        console.log("retrying..");
        await this.getDeposit();
      } else {
        this.spinner.hide();
        this.retries = 0;
      }
    });
  }

  async getMyDeposits() {
    this.spinner.show();
    let res!: Response;
    await this.depositService.getDepositsByAddress(this.searchValue, this.response.index, this.count).then(data => {
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
        await this.getMyDeposits();
      } else {
        this.spinner.hide();
        this.retries = 0;
      }
    });
    
    return res;
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
    await this.getMyDeposits().then((data) => {
      if (data) {
        this.cache.push(data);
      }
    });
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
