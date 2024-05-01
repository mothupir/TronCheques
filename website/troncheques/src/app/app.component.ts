import { Component } from '@angular/core';
import { WalletService } from './service/wallet/wallet.service';
import { DepositService } from './service/deposit/deposit.service';
import { SpinnerService } from './service/spinner/spinner.service';
import { WithdrawService } from './service/withdraw/withdraw.service';

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
    { id: 3, name: "History", link: 'history', icon: 'pi pi-history', available: true },
    { id: 4, name: "Admin", link: 'admin', icon: 'pi pi-user-edit', available: true }
  ];

  connected = false;
  visible = false;

  constructor(
    private walletService: WalletService, 
    private depositService: DepositService, 
    private withdrawService: WithdrawService, 
    private spinner: SpinnerService
  ) {}

  async ngOnInit() {
    this.connected = await this.walletService.isConnected();
    if (this.connected) {
      this.items = this.items.map(item => {
        if (item.name == "History") item.available = true;
        let addr;
        //this.depositService.getOwner().then(res => addr = res);
        if (this.walletService.getAddress() ==  addr && item.name == "Admin") item.available = true; 
        return item;
      });
    }
  }

  async ngAfterViewInit() {
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
    !this.walletService.isConnected() ? this.walletService.connect().then(() => {
      this.items = this.items.map(item => {
        let addr;
        //this.depositService.getOwner().then(res => addr = res);
        if (this.walletService.getAddress() == addr && item.name == "Admin") item.available = true; 
        this.connected = true;
        return item;
      });
    }).catch(err => console.log("Err: ", err)) :
    this.walletService.disconnect().then(() => {
      this.items = this.items.map(item => {
        if (item.name == "Admin") item.available = false;
        this.connected = false;
        return item;
      });
    });
    console.log("Here: ")
    const tronWeb: any = window.tronWeb;
    const contract = await tronWeb.contract().at('TYfJeDpcWC6NcYiC6TrAceT5pQArYP1oM8');
    //console.log("Value: ", contract.getOwner());
  }

  getYear() {
    return new Date().getFullYear();
  }
}
