import { Injectable } from '@angular/core';
import { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private tronLink: TronLinkAdapter;

  constructor() {
    this.tronLink = new TronLinkAdapter();
  }

  async connect(wallet: any) {
    switch(wallet.code) {
      case 'tronlink':
        this.tronLink.connect();
        console.log("Connect here")
        break;
    }
    await this.delay(10000);

    const connected = await this.isConnected();

    if (!connected) {
      throw new Error('Failed to connected check if your wallet is unlocked.')
    }
  }

  async disconnect() {
    this.tronLink.disconnect();
    await this.delay(3000);
  }

  async isConnected() {
    return this.tronLink.connected;
  }

  async getAddress() {
    return this.tronLink.address;
  }

  delay = (ms:any) => new Promise(res => setTimeout(res, ms));
}
