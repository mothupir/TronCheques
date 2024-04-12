import { Component } from '@angular/core';
import { DepositService } from '../service/deposit/deposit.service';
import { Payment, Payments } from '../model/deposit.model';
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
  fee: any = { id: 0, threshold: 0, deposit: 0, reversal: 0 };

  fees: any[] = [
    { id: 0, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 1, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 2, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 3, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 4, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 5, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 6, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 6, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 6, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 6, threshold: 100000, deposit: 1000, reversal: 500 },
    { id: 6, threshold: 100000, deposit: 1000, reversal: 500 },
  ];

  minimum: number = 0;
  maximum: number = 0;

  totalPayments: number = 0;
  activePayments: number = 0;
  totalValue: number = 0;
  activeValue: number = 0;
  accountValue: number = 0;


  searchCriterion!: SearchCriterion;
  searchValue = ""
  searchCriteria: SearchCriterion[] = [
    { code: "index", name: "Withdrawal Code" },
    { code: "owner", name: "Deposit Owner" }
  ];
  payments: Payments = new Payments();
  payment: Payment = new Payment();

  addEditVisible = false;
  viewVisible = false;

  constructor(
    private depositService: DepositService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
    ) {}

  ngOnInit() {
    let payment = new Payment();
    payment.active = true;
    this.payments.payments.push(new Payment(), payment, new Payment());
  }

  // Statistics
  async getStatistics() {
    await this.depositService.getStatistics().then((data: any) => {
      this.totalPayments = data.totalPayments;
      this.activePayments = data.activePayments;
      this.totalValue = data.totalValue;
      this.activeValue = data.activeValue;
      this.accountValue = data.accountValue;
    })
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
      this.fee = { id: -1, threshold: 0, deposit: 0, reversal: 0 };
    } else {
      let index = this.fees.findIndex((f: any) => f.id == id);
      if (index > -1) {
        this.fee = { id: this.fees[index].id, threshold: this.fees[index].threshold, deposit: this.fees[index].deposit, reversal: this.fees[index].reversal };
      }
    }
    this.addEditVisible = true;
  }

  addEditFee(id: number) {
    if (id < 0) {
      let newId: number = Math.max(...this.fees.map(f => f.id));
      this.fees.push(this.fee);
      this.fee = { id: newId, threshold: 0, deposit: 0, reversal: 0 };
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
    this.fee = { id: 0, threshold: 0, deposit: 0, reversal: 0 };
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
