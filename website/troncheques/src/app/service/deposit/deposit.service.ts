import { Injectable } from '@angular/core';
import { abi } from './abi';
import * as crypto from 'crypto-js';
import { Buffer } from 'buffer';
import { environment } from '../../../environments/environment';
import { Fee, Statistic } from '../../model/deposit.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  contract: any;
  tronWeb: any;

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
      data.forEach((d: any) => {
        let fee: Fee = new Fee();
        fee.id = this.tronWeb.BigNumber(d[0]._hex).toNumber();
        fee.min = this.tronWeb.BigNumber(d[1]._hex).toNumber();
        fee.max = this.tronWeb.BigNumber(d[2]._hex).toNumber();
        fee.deposit = this.tronWeb.BigNumber(d[3]._hex).toNumber();
        fee.reversal = this.tronWeb.BigNumber(d[4]._hex).toNumber();
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
    let minList = fees.map(fee => fee.min);
    let maxList = fees.map(fee => fee.max);
    let depList = fees.map(fee => fee.deposit);
    let revList = fees.map(fee => fee.reversal);

    try {
      await this.contract.setFees(idList, minList, maxList, depList, revList).send({
        feeLimit:1000,
        callValue:0,
        shouldPollResponse:true
      });
    } catch (e: any) {
      throw new Error(e.error);
    }
  }
  // End - Fees

  // Begin - Deposit
  async deposit(address: string, amount: number, code: string, desc: string) {
    
  }

  async reverse(index: number) {

  }

  async getDeposit(index: number) {

  }

  async getDeposits(index: number, count: number) {

  }

  async getMyDeposits(index: number, count: number, address: string) {

  }
  // End - Deposit
}
