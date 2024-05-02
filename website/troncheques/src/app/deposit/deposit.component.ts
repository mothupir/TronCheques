import { Component } from '@angular/core';
import { WalletService } from '../service/wallet/wallet.service';
import { DepositService } from '../service/deposit/deposit.service';
import { Deposit, Fee } from '../model/deposit.model';
import { SpinnerService } from '../service/spinner/spinner.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  walletAddress: string | null = "";
  amount = 0;
  fee = 0;
  description = "";
  
  showWithdrawDialog = false;
  showConfirmDialog = false;

  deposit: Deposit = new Deposit();
  fees: Fee[] = [];
  min: number = 0;
  max: number = 0;

  privateKey = "";
  wallet = "";
  walletList = [{ code: "tronlink", name: "TronLink" }];

  constructor(
    private walletService: WalletService, 
    private depositService: DepositService,
    private messageService: MessageService,
    private spinner: SpinnerService,
    private client: HttpClient
  ) {}

  async ngOnInit() {
    await this.getTransactionalFees();
  }

  async getTransactionalFees() {
    this.spinner.show();
    this.client.get<Fee[]>(env.BASE_URL + 'fees/all').subscribe(
      data => {
        this.fees = data;
        if (this.fees.length > 0) {
          this.min = this.fees[0].min;
          this.max = this.fees[this.fees.length - 1].deposit
        }
        this.spinner.hide();
      },
      error => {
        this.messageService.add({ severity: 'warn', summary: 'Fees Error.', detail: `\n ${error.message}` });
        this.spinner.hide();
      }
    );
  }

  confirm() {
    if (this.amount < this.min) {
      this.messageService.add({ severity: 'warn', summary: 'Amount Error.', detail: `\n Minimum amount you can deposit is, ${this.min} trx` });
      return;
    }
    if (!this.description || this.description.length < 3) {
      this.messageService.add({ severity: 'warn', summary: 'Reference Error.', detail: `\n Reference should be at least 3 characters.` });
      return;
    }
    this.fee = this.getFee();
    this.showConfirmDialog = true;
  }

  getFee(): number {
    let fee: Fee = new Fee();
    let fees = this.fees.filter(f => this.amount >= f.min && this.amount <= f.max);
    if (fees && fees.length > 0) {
      return fees[0].deposit;
    }
    return this.fees[this.fees.length - 1].deposit;
  }

  async clear() {
    this.walletAddress = "";
    this.amount = 0;
    this.description = "";
  }

  async depositWithWallet() {
    this.showConfirmDialog = false;
    this.spinner.show();
    
    const password = this.depositService.generate();
    const code = uuid().toUpperCase();
    this.client.post(env.BASE_URL + 'deposit', { password: password}).subscribe(
      async (hash: any) => {
        await this.depositService.depositWithWallet(code, hash, this.amount, this.description).then(() => {
          this.messageService.add({ severity: 'success', summary: 'Deposit Successful', detail: 'Amount was successfully deposited, wait a few minutes for it to reflect on your history.' });
          this.deposit.amount = this.amount;
          this.deposit.hash = password;
          this.deposit.uuid = code;
          this.deposit.fee = this.getFee();
          this.spinner.hide();

          this.showWithdrawDialog = true;
        }).catch(error => {
          this.messageService.add({ severity: 'warn', summary: 'Deposit Error.', detail: `\n ${error.error}` });
          this.spinner.hide();
        });
      },
      error => {
        this.messageService.add({ severity: 'warn', summary: 'Deposit Error.', detail: `\n ${error.error}` });
        this.spinner.hide();
      }
    );
  }

  async depositWithPrivateKey() {
    this.spinner.show();
    this.showConfirmDialog = false;
    const password = this.depositService.generate();
    const code = uuid().toUpperCase();

    console.log(this.privateKey);

    this.client.post(env.BASE_URL + 'deposit/key', {
      code: code,
      password: password,
      amount: this.amount,
      ref: this.description,
      key: this.privateKey
    }).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Deposit Successful', detail: 'Amount was successfully deposited, wait a few minutes for it to reflect on your history.' });
        this.deposit.amount = this.amount;
        this.deposit.hash = password;
        this.deposit.uuid = code;
        this.deposit.fee = this.getFee();
        this.spinner.hide();

        this.showWithdrawDialog = true;
      },
      error => {
        this.messageService.add({ severity: 'warn', summary: 'Deposit Error.', detail: `\n ${error.message}` });
        this.spinner.hide();
      }
    );
  }

  copy(id: string) {
    this.messageService.add({ severity: 'info', detail: 'Copied', life: 2500 });
    let text = document.getElementById(id)!.innerText;
    navigator.clipboard.writeText(text);
  }
}
