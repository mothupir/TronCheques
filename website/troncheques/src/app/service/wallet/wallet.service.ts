import { Injectable } from '@angular/core';
import { Adapter } from '@tronweb3/tronwallet-abstract-adapter';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  tronLink: TronLinkAdapter;

  wallets: Adapter[] = [];

  constructor() {
    this.tronLink = new TronLinkAdapter();
  }

  connect() {
    this.tronLink.connect();
  }
}
