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

  async connect() {
    this.tronLink.connect();
  }

  async disconnect() {
    this.tronLink.disconnect();
  }

  async isConnected() {
    return this.tronLink.connected;
  }

  async getAddress() {
    return this.tronLink.address;
  }
}
