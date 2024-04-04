import { Component } from '@angular/core';
import { WalletService } from './service/wallet/wallet.service';
import { DepositService } from './service/deposit/deposit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tron Cheques';

  items = [
    { id: 1, name: "Deposit", link: 'deposit', icon: 'pi pi-user-minus', available: true },
    { id: 2, name: "Withdraw", link: 'withdraw', icon: 'pi pi-user-plus', available: true },
    { id: 3, name: "History", link: 'history', icon: 'pi pi-history', available: false },
    { id: 4, name: "Admin", link: 'admin', icon: 'pi pi-user-edit', available: false }
  ];

  connected = false;
  visible = false;

  constructor(private walletService: WalletService, private depositService: DepositService) {
    this.connected = this.walletService.tronLink.connected;
    if (this.connected) {
      this.items = this.items.map(item => {
        if (item.name == "History") item.available = true;
        let addr;
        //this.depositService.getOwner().then(res => addr = res);
        if (this.walletService.tronLink.address ==  addr && item.name == "Admin") item.available = true; 
        return item;
      });
    }
  }

  ngAfterViewInit() {
    this.onNavClick(this.getUrl());
  }

  getUrl(): string {
    const href = window.location.href;
    const name = this.items.filter(item => href.includes(item.link))[0]?.name
    return name ? name : 'Deposit';
  }

  onNavClick(id: string) {
    this.items.forEach(item => {
      if (item.available) {
        document.getElementById(item.name)!.style.color = 'white';
        document.getElementById(item.name)!.style.background = 'transparent';
      }
    });
    document.getElementById(id)!.style.color = 'black';
    document.getElementById(id)!.style.background = 'var(--highlight-bg)';
  }

  async connect() {
    !this.walletService.tronLink.connected ? this.walletService.tronLink.connect().then(() => {
      this.items = this.items.map(item => {
        if (item.name == "History") item.available = true;
        let addr;
        //this.depositService.getOwner().then(res => addr = res);
        if (this.walletService.tronLink.address == addr && item.name == "Admin") item.available = true; 
        if (item.name == "History") item.available = true;
        this.connected = true;
        return item;
      });
    }).catch(err => console.log("Err: ", err)) :
    this.walletService.tronLink.disconnect().then(() => {
      this.items = this.items.map(item => {
        if (item.name == "History" || item.name == "Admin") item.available = false;
        this.connected = false;
        return item;
      });
    });
    console.log("Here: ")
    const tronWeb: any = window.tronWeb;
    const contract = await tronWeb.contract().at('TYfJeDpcWC6NcYiC6TrAceT5pQArYP1oM8');
    //console.log("Value: ", contract.getOwner());
  }
}
