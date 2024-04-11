import { Component } from '@angular/core';
import { WalletService } from '../service/wallet/wallet.service';
import { DepositService } from '../service/deposit/deposit.service';
import { Payment } from '../model/deposit.model';
import { SpinnerService } from '../service/spinner/spinner.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  walletAddress: string | null = "";
  currency = "sun";
  amount = 0;
  withdrawalCode = "";
  description = "";
  
  showDialog = false;

  deposit: Payment = new Payment();
  fees: any[] = [
    { threshold: 100000, deposit: 1000, reversal: 500 },
    { threshold: 100000, deposit: 1000, reversal: 500 },
    { threshold: 100000, deposit: 1000, reversal: 500 },
    { threshold: 100000, deposit: 1000, reversal: 500 },
    { threshold: 100000, deposit: 1000, reversal: 500 },
    { threshold: 100000, deposit: 1000, reversal: 500 },
    { threshold: 100000, deposit: 1000, reversal: 500 },
  ];

  invalid = "ng-invalid";
  dirty = "ng-dirty";
  invalidCode = "";

  constructor(
    private walletService: WalletService, 
    private depositService: DepositService,
    private spinner: SpinnerService) {
    
  }

  async confirm() {
    console.log("Wallet Address: ", this.walletAddress);
    console.log("Currency: ", this.currency);
    console.log("Amount: ", this.amount);
    console.log("Withdral Code: ", this.withdrawalCode);

    document.getElementById("amount")?.classList.add(this.invalid, this.dirty);
    document.getElementById("code")?.classList.add(this.invalid, this.dirty);
    document.getElementById("walletAddress")?.classList.add(this.invalid, this.dirty);

    //await this.depositService.connectToContract();

    

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.showDialog = true;
    }, 5000);
  }

  async useConnectedWallet() {
    this.walletAddress = this.walletService.tronLink.address;
  }



  async generate() {
    const length = Math.floor(Math.random() * 9) + 8;
    let str = '';
    Array.from({length}).some(() => {
      str += Math.random().toString(36).slice(2);
      return str.length >= length;
    });
    this.withdrawalCode = str.slice(0, length).toUpperCase();
  }

  async clear() {
    this.walletAddress = "";
    this.amount = 0;
    this.withdrawalCode = "";
    this.description = "";
  }
}
