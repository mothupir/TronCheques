import { Injectable } from '@angular/core';
import { abi } from './abi';
import { environment as env } from '../../../environments/environment';
import { Deposit, Fee, Statistic } from '../../model/deposit.model';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  connected: boolean = false;

  constructor(
    private wallet: WalletService,
  ) {}

  // Begin - Deposit
  async depositWithPrivateKey(privateKey: string, amount: number, fee: number, desc: string) {
    
  }

  async connectWithWallet(): Promise<any> {
    const tronWeb = window.tronWeb;
    setTimeout(async () => {
      //return await tronWeb.contract(abi, env.DEPOSIT_ADDRESS);
    }, 3000);
  }

  async depositWithWallet(amount: number, desc: string) {

  }

  async reverse(index: number) {

  }

  async getDeposit(index: number) {

  }

  async getDeposits(index: number, count: number) {

  }

  async getMyDeposits(index: number, count: number, address: string) {

  }
  
  private generate() {
    const length = Math.floor(Math.random() * 9) + 8;
    let str = '';
    Array.from({length}).some(() => {
      str += Math.random().toString(36).slice(2);
      return str.length >= length;
    });
    return str.slice(0, length).toUpperCase();
  }
  // End - Deposit
}
