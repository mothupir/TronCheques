import { Component } from '@angular/core';
import { WalletService } from '../service/wallet/wallet.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { SpinnerService } from '../service/spinner/spinner.service';
import { DepositService } from '../service/deposit/deposit.service';

interface WithdrawMethod {
  name: string;
  code: string;
  active: boolean
}

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent {
  retries: number = 0;
  maxRetries: number = 2;

  walletAddress: string = "";
  withdrawalCode: string = "";
  password: string = "";

  showConfirmDialog: boolean = false;

  withdrawMethod!: WithdrawMethod;
  withdrawMethodList!: WithdrawMethod[];

  constructor(
    private depositService: DepositService,
    private messageService: MessageService,
    private client: HttpClient,
    private spinner: SpinnerService
  ) {}

  ngOnInit() {
    this.withdrawMethodList = [
      { name: "Wallet", code: "wallet", active: true }
    ];
    this.withdrawMethod = this.withdrawMethodList[0];
  }

  async confirm() {
    if (this.withdrawalCode.length < 32) {
      this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Invalid Withdraw ID.' });
      return;
    }
    
    if (this.password.length < 8 || this.password.length > 16) {
      this.messageService.add({ severity: 'warn', summary: 'Error', detail: 'Invalid Password.' });
      return;
    }
    this.showConfirmDialog = true;
  }

  async withdraw() {
    if (this.withdrawMethod.code == 'wallet') {
      await this.withdrawWithWallet();
    } else if (this.withdrawMethod.code == 'off-ramp') {
      await this.withdrawWithCard();
    }
  }

  async withdrawWithWallet() {
    this.spinner.show();
    this.showConfirmDialog =  false;
    this.client.post(env.BASE_URL + 'withdraw', {
      uuid: this.withdrawalCode,
      password: this.password,
      address: this.walletAddress
    }).subscribe(
      data => {
        this.messageService.add({ severity: 'success', summary: 'Withdraw Successful', detail: 'Withdrawal was success, the amount should reflect in your account soon.' });
        this.spinner.hide();
      },
      async error => {
        if (this.retries <= this.maxRetries) {
          this.retries++;
          await this.depositService.delay(3000);
          console.log("retrying..");
          await this.withdrawWithWallet();
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Withdraw Error', detail: error.error });
          this.spinner.hide();
          this.retries = 0;
        }
      }
    );
  }

  async withdrawWithCard() {
    this.messageService.add({ severity: 'warn', summary: 'Withdraw Error', detail: "Currently not supported" });
  }

  async clear() {
    this.walletAddress = "";
    this.withdrawalCode = "";
    this.password = "";
  }
}
