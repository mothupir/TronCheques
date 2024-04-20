import { Component } from '@angular/core';
import { WalletService } from '../service/wallet/wallet.service';
import { DepositService } from '../service/deposit/deposit.service';
import { Deposit, Fee } from '../model/deposit.model';
import { SpinnerService } from '../service/spinner/spinner.service';
import { MessageService } from 'primeng/api';

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
  showConfirmDialog = false;

  deposit: Deposit = new Deposit();
  fees: Fee[] = [];
  min: number = 0;
  max: number = 0;

  privateKey = "";
  wallet = "";
  walletList = [{ code: "tronlink", name: "TronLink" }, { code: "tronlink", name: "TronLink" }];

  constructor(
    private walletService: WalletService, 
    private depositService: DepositService,
    private messageService: MessageService,
    private spinner: SpinnerService) {
    
  }

  async ngOnInit() {
    await this.getTransactionalFees();
  }

  async confirm() {
    this.showConfirmDialog = true;
  }

  async depositWithWallet() {
    this.showConfirmDialog = false;
    this.spinner.show();
    setTimeout(() => { this.spinner.hide(); }, 5000);
  }

  async depositWithPrivateKey() {
    this.showConfirmDialog = false;
    this.spinner.show();
    setTimeout(() => { this.spinner.hide(); }, 5000);
  }

  async useConnectedWallet() {
    this.walletAddress = this.walletService.tronLink.address;
  }

  async clear() {
    this.walletAddress = "";
    this.amount = 0;
    this.withdrawalCode = "";
    this.description = "";
  }

  async getTransactionalFees() {
    await this.depositService.getFees().then(data => {
      this.fees = data;
    }).catch((e) => {
      this.messageService.add({ severity: 'warn', summary: 'Failed to get fees.', detail: `\n ${e.message}` });
    });
  }
}
