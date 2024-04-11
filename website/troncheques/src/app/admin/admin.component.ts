import { Component, numberAttribute } from '@angular/core';
import { DepositService } from '../service/deposit/deposit.service';

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
  ]

  addEditVisible = false;

  constructor(private depositService: DepositService) {}

  async updateFees() {
    await this.depositService.updateFees(this.fees);
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
  showAddEditFeeDialog(id: number) {
    if (id < 0) {
      let newId: number = Math.max(...this.fees.map(f => f.id));
      this.fee = { id: newId, threshold: 0, deposit: 0, reversal: 0 };
    } else {
      let index = this.fees.indexOf((f: any) => f.id == id);
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
      let index = this.fees.indexOf((f: any) => f.id == id);
      if (index > -1) {
        this.fees[index] = this.fee;
      }
    }
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
}
