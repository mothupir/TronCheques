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
    console.log("Tron: ", tronWeb);
    console.log("Sun: ", tronWeb.toSun(2));
    this.contract = await tronWeb.contract(abi, '4153049c7593acedf010f2e0e505389deb36f4f230');
    console.log("Addr: ", await this.contract.getOwner().call());
    console.log(this.contract);
  }

  async getOwner() {
    return await this.contract.getOwner().call();
  }
}
