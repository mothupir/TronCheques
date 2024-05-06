import { Component } from '@angular/core';
import { WalletService } from './service/wallet/wallet.service';
import { DepositService } from './service/deposit/deposit.service';
import { SpinnerService } from './service/spinner/spinner.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  wallet = "";
  walletList = [{ code: "tronlink", name: "TronLink" }];

  connected = false;
  visible = false;

  isAdmin: boolean = false;
  isConnected: boolean = false;

  constructor(
    private walletService: WalletService, 
    private depositService: DepositService,
    private spinner: SpinnerService,
    private messageService: MessageService,
    private router: Router
  ) {
   }

  async ngOnInit() {
    console.log("Connected:", this.isConnected);
  }

  async updateNav() {
    this.isConnected = await this.walletService.isConnected();
    const address = await this.walletService.getAddress();
    this.isAdmin = await this.depositService.isOwner(address || "");
  }

  async ngAfterViewInit() {
    let url = this.getUrl();
    if (url.toLowerCase() == 'admin' || url.toLowerCase() == 'history') {
      this.isConnected = await this.walletService.isConnected();
      if (!this.isConnected) {
        this.updateNav();
        this.router.navigateByUrl('deposit');
        this.onNavClick('deposit');
      }
    }
    await this.updateNav();
    this.onNavClick(url);
  }

  getUrl(): string {
    const href = window.location.href;
    const i1 = href.lastIndexOf('/') + 1;
    const i2 = href.length;
    const str = href.slice(i1, i2);
    return str || 'deposit';
  }

  onNavClick(id: string) {
    id = id.toLocaleLowerCase();
    document.getElementById('deposit')?.classList.remove('active');
    document.getElementById('withdraw')?.classList.remove('active');
    document.getElementById('history')?.classList.remove('active');
    document.getElementById('admin')?.classList.remove('active');
    document.getElementById(id)?.classList.add('active');
  }

  async connect() {
    if (await this.walletService.isConnected()) {
      await this.disconnect();
      return;
    }

    this.spinner.show();
    await this.walletService.connect(this.wallet).then(async () => {
      await this.updateNav();
      this.spinner.hide();
    }).catch (error => {
      this.messageService.add({ severity: 'warn', summary: 'Connection Error.', detail: `\n ${error.message}` });
      this.spinner.hide();
    });
  }

  async disconnect() {
    this.spinner.show();
    await this.walletService.disconnect();
    this.updateNav();
    this.router.navigateByUrl('deposit');
    this.onNavClick('deposit');
    this.spinner.hide();
  }

  getYear() {
    return new Date().getFullYear();
  }
}
