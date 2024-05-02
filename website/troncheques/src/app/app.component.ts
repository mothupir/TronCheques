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
    { id: 3, name: "History", link: 'history', icon: 'pi pi-history', available: true },
    { id: 4, name: "Admin", link: 'admin', icon: 'pi pi-user-edit', available: true }
  ];

  wallet = "";
  walletList = [{ code: "tronlink", name: "TronLink" }];

  connected = false;
  visible = false;

  constructor(
    private walletService: WalletService, 
    private depositService: DepositService,
    private spinner: SpinnerService,
    private messageService: MessageService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.updateNav();
  }

  async updateNav() {
    this.connected = await this.walletService.isConnected();

    if (!this.connected) {
      this.items[2].available = false;
      this.items[3].available = false;
      return;
    }

    const address = await this.walletService.getAddress();
    const isdAmin = await this.depositService.isOwner(address || "");

    if (!isdAmin) {
      this.items[3].available = false;
    }
  }

  async ngAfterViewInit() {
    let url = this.getUrl();
    if (!this.connected && (url == 'Admin' || url == 'History')) {
      url = 'Deposit';
    }
    this.onNavClick(url);
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
    if (this.connected) {
      await this.disconnect();
      return;
    }

    this.spinner.show();
    await this.walletService.connect(this.wallet).then(async () => {
      this.spinner.hide();
      location.reload();
      this.messageService.add({ severity: 'success', summary: 'Connection Success.', detail: `\n Connected successfully` });
    }).catch (error => {
      this.messageService.add({ severity: 'warn', summary: 'Connection Error.', detail: `\n ${error.message}` });
      this.spinner.hide();
    });
  }

  async disconnect() {
    this.spinner.show();
    await this.walletService.disconnect().then(() => {
      this.updateNav();
      this.onNavClick(this.getUrl());
      this.spinner.hide();
      this.router.navigate(['/deposit']);
    });
  }

  getYear() {
    return new Date().getFullYear();
  }
}
