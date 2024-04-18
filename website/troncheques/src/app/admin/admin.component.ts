import { Component } from '@angular/core';
import { DepositService } from '../service/deposit/deposit.service';
import { Fee, Deposit, Response, Statistic } from '../model/deposit.model';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

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
  fee: Fee = new Fee();
  fees: Fee[] = [];

  minimum: number = 0;
  maximum: number = 0;

  statistics: Statistic = new Statistic();

  searchCriterion!: SearchCriterion;
  searchValue = ""
  searchCriteria: SearchCriterion[] = [
    { code: "index", name: "Withdrawal Code" },
    { code: "owner", name: "Deposit Owner" }
  ];

  response: Response = new Response();
  deposit: Deposit = new Deposit();

  addEditVisible = false;
  viewVisible = false;

  constructor(
    private depositService: DepositService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {}

  ngOnInit() {
    let deposit = new Deposit();
    deposit.active = true;
    this.response.deposits.push(new Deposit(), deposit, new Deposit());
  }

  // Statistics
  async getStatistics() {
    await this.depositService.getStatistics().then((data: any) => {
      
    });
  }

  // Fees
  async getTransactionalFees() {
    await this.depositService.getTransactionalFees();
  }

  async updateFees() {
    await this.depositService.updateFees(this.fees).then((data: boolean) => {
      data ? this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Fees updated successfully.' }) : this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Failed to update fees.' });
    });
  }

  showAddEditFeeDialog(id: number) {
    if (id < 0) {
      this.fee.id = -1;
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
    if (id < 0) {
      this.fees.push(this.fee);
      this.fee.id = Math.max(...this.fees.map(f => f.id)) + 1;
      this.fee.min = 0;
      this.fee.max = 0;
      this.fee.deposit = 0;
      this.fee.reversal = 0;
    } else {
      let index = this.fees.findIndex((f: any) => f.id == id);
      if (index > -1) {
        this.fees[index] = this.fee;
      }
    }
    this.addEditVisible = false;
  }

  removeFee(id: number) {
    let index = this.fees.findIndex((f: any) => f.id == id);
    console.log(index);
    console.log(id);
    if (index > -1) {
      this.fees.splice(index, 1);
      console.log(this.fees);
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
    }
  }

  async getDeposit() {
    console.log('Index: ', this.searchValue);
  }

  async getMyDeposits() {
    console.log('Owner: ', this.searchValue);
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
