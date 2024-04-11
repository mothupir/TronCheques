import { Injectable } from '@angular/core';
import { abi } from './abi';
import * as crypto from 'crypto-js';
import { Buffer } from 'buffer';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  contract: any;

  constructor() { 
    /*setTimeout(() => {
      this.connectToContract();
    }, 5000);*/
  }

  async connectToContract() {
    const tronWeb: any = window.tronWeb;
    this.contract = await tronWeb.contract(abi, environment.deposit);
    console.log("Addr: ", await this.contract.getOwner().call());
    console.log(this.contract);

    let encrypted = this.encrypt("This is Mike");
    console.log("Encypted: ", encrypted);

    encrypted = this.encrypt("This is Mike");
    console.log("Encypted: ", encrypted);
    console.log("Decrypted: ", this.decrypt(encrypted));
  }

  async getOwner() {
    return await this.contract.getOwner().call();
  }

  async makeDeposit(address: string, amount: number, code: string, desc: string) {

  }

  async getDeposit(index: number) {

  }

  async getDeposits(index: number, count: number) {

  }

  async getMyDeposits(index: number, count: number, address: string) {

  }

  private encrypt(text: string): string {
    return crypto.AES.encrypt(text, environment.key).toString();
  }

  private encode(text: string): string {
    return Buffer.from(text, 'binary').toString('base64');
  }

  private decrypt(text: string): string {
    return crypto.AES.decrypt(text, environment.key).toString(crypto.enc.Utf8);
  }

  private decode(text: string): string {
    return Buffer.from(text, 'base64').toString('binary');
  }
}
