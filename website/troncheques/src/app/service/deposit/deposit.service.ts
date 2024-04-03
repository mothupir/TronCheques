import { Injectable } from '@angular/core';
import { abi } from './abi';

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
    this.contract = await tronWeb.contract(abi).at('TYfJeDpcWC6NcYiC6TrAceT5pQArYP1oM8');
    console.log("Addr: ", await this.contract.getOwner().call());
    console.log(this.contract);
  }

  async getOwner() {
    return await this.contract.getOwner().call();
  }
}
