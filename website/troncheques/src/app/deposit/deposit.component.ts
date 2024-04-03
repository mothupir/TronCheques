import { Component } from '@angular/core';
import { WalletService } from '../service/wallet/wallet.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  walletAddress: string | null = "";
  currency = "sun";
  amount = 0;
  withdralCode = "";

  constructor(private walletService: WalletService) {}

  async confirm() {
    console.log("Wallet Address: ", this.walletAddress);
    console.log("Currency: ", this.currency);
    console.log("Amount: ", this.amount);
    console.log("Withdral Code: ", this.withdralCode);
  }

  async useConnectedWallet() {
    this.walletAddress = this.walletService.tronLink.address;
  }

  async generate() {
    this.withdralCode = "12345678";
  }
}
