import { Injectable } from '@angular/core';
import { abi } from './abi';
import { environment } from '../../../environments/environment';
import { Fee, Statistic } from '../../model/deposit.model';
import { WalletService } from '../wallet/wallet.service';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  contract: any;
  tronWeb: any;

  constructor(private wallet: WalletService) {}

  async connect() {
    this.tronWeb = window.tronWeb;
    this.contract = await this.tronWeb.contract(abi, environment.DEPOSIT_ADDRESS);
  }

  async getOwner() {
    return await this.contract.getOwner().call();
  }

  async getStatistics() {
    const data: Statistic = await this.contract.getStatistics().send();
    console.log("Stats:", data);
  }

  // Begin - Fees
  async getFees(): Promise<Fee[]> {
    let fees: Fee[] = [];

    try {
      const data = await this.contract.getFees().call();
      console.log("Data:", data);
      data.forEach((d: any) => {
        let fee: Fee = new Fee();
        fee.id = this.tronWeb.BigNumber(d.id._hex).toNumber();
        fee.min = this.tronWeb.fromSun(this.tronWeb.BigNumber(d.min._hex).toNumber());
        fee.max = this.tronWeb.fromSun(this.tronWeb.BigNumber(d.max._hex).toNumber());
        fee.deposit = this.tronWeb.fromSun(this.tronWeb.BigNumber(d.deposit._hex).toNumber());
        fee.reversal = this.tronWeb.fromSun(this.tronWeb.BigNumber(d.reversal._hex).toNumber());
        fees.push(fee);
        return fees;
      });
    } catch (e: any) {
      throw new Error(e.error);
    };

    return fees;
  }

  async updateFees(fees: Fee[]) {
    let idList = fees.map(fee => fee.id);
    let minList = fees.map(fee => this.tronWeb.toSun(fee.min));
    let maxList = fees.map(fee => this.tronWeb.toSun(fee.max));
    let depList = fees.map(fee => this.tronWeb.toSun(fee.deposit));
    let revList = fees.map(fee => this.tronWeb.toSun(fee.reversal));

    try {
      await this.contract.setFees(idList, minList, maxList, depList, revList).send({
        feeLimit:15_000_000_000,
        callValue:0,
        shouldPollResponse:true
      });
    } catch (e: any) {
      throw new Error(e.error);
    }
  }
  // End - Fees

  // Begin - Deposit
  async depositWithPrivateKey(privateKey: string, amount: number, desc: string) {
    
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
  
  async generate() {
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
