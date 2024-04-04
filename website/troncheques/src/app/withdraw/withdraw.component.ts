import { Component } from '@angular/core';
import { WalletService } from '../service/wallet/wallet.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent {
  walletAddress: string | null = "";
  currency = "sun";
  amount = 0;
  withdrawalCode = "";

  constructor(private walletService: WalletService) {}

  async confirm() {
    console.log("Wallet Address: ", this.walletAddress);
    console.log("Currency: ", this.currency);
    console.log("Amount: ", this.amount);
    console.log("Withdral Code: ", this.withdrawalCode);
  }

  async useConnectedWallet() {
    this.walletAddress = this.walletService.tronLink.address;
  }

  async clear() {
    this.walletAddress = "";
    this.amount = 0;
    this.withdrawalCode = "";
  }
}
