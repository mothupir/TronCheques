import { Injectable } from '@angular/core';
import { abi } from './abi';
import { environment as env } from '../../../environments/environment';
import { Deposit, Fee, Response, Statistic } from '../../model/deposit.model';
import { WalletService } from '../wallet/wallet.service';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  tronWeb: any;
  contract: any;
  connected: boolean = false;
  address: string | null = "";

  constructor(
    private wallet: WalletService,
    private client: HttpClient
  ) {}

  // Begin - Deposit
  async connectToContract() {
    const walletConnected = await this.wallet.isConnected();
    if (!walletConnected) {
      await this.wallet.connect();
      this.address = await this.wallet.getAddress();
    }

    if (!this.contract) {
      this.tronWeb = window.tronWeb;
      await delay(5000);
      this.contract = await this.tronWeb.contract(abi, env.DEPOSIT_ADDRESS);
      this.connected = true;
    }
  }

  async depositWithWallet(uuid: string, hash: string, amount: number, ref: string) {
    if (!this.contract) await this.connectToContract();

    const timestamp: number = new Deposit().setDate(new Date());
    const fee = await this.contract.getDepositFee(this.tronWeb.toSun(amount)).call();
    const value = parseInt(this.tronWeb.toSun(amount)) + parseInt(this.tronWeb.BigNumber(fee._hex).toNumber());

    await this.contract.deposit(uuid, hash, this.tronWeb.toSun(amount), ref, timestamp).send({
      feeLimit:15_000_000_000,
      callValue: value,
      shouldPollResponse:true
    });
  }

  async reverse(uuid: string) {
    if (!this.contract) await this.connectToContract();

    try {
      await this.contract.reverse(uuid).send({
        feeLimit:15_000_000_000,
        callValue: 0,
        shouldPollResponse:true
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getDeposit(uuid: string) {
    if (!this.contract) await this.connectToContract();

    try {
      const data = await this.contract.getDeposit(uuid).call();
      return this.toDeposit(data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getDeposits(index: number, count: number) {
    if (!this.contract) await this.connectToContract();

    let response = new Response();

    try {
      const data = await this.contract.getDeposits(index, count).call();
      response.index = this.tronWeb.BigNumber(data.index._hex).toNumber();
      data.deposits.forEach((res:any) => response.deposits.push(this.toDeposit(res)));
    } catch (error: any) {
      throw new Error(error.message);
    }
    
    return response;
  }

  delay = (ms:any) => new Promise(res => setTimeout(res, ms));

  async getMyDeposits(index: number, count: number, address: string) {
    if (!this.contract) await this.connectToContract();

    try {
      return await this.contract.getDepositsByAddress(address, index, count).call();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  private toDeposit(data: any): Deposit {
    let deposit = new Deposit();

    deposit.uuid = data.uuid;
    deposit.hash = data.hash;
    deposit.amount = this.tronWeb.fromSun(this.tronWeb.BigNumber(data.amount._hex).toNumber());
    deposit.fee = this.tronWeb.fromSun(this.tronWeb.BigNumber(data.fee._hex).toNumber());
    deposit.ref = data.ref;
    deposit.owner = data.owner;
    deposit.withdrawn = data.withdrawn;
    deposit.reversed = data.reversed;
    deposit.blocked = data.blocked;
    deposit.withdrawer = data.withdrawer;
    deposit.timestamp = this.tronWeb.BigNumber(data.timestamp._hex).toNumber();
    deposit.active = data.active;

    return deposit;
  }
  
  generate() {
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
