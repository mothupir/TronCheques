import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tron Cheques';

  href: string = "";

  items = [
    { id: 1, name: "Deposit", link: 'deposit', available: true },
    { id: 2, name: "Withdraw", link: 'withdraw', available: true },
    { id: 3, name: "History", link: 'history', available: false },
    { id: 4, name: "Admin", link: 'admin', available: false }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    
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
      document.getElementById(item.name)!.style.background = 'none';
    });
    document.getElementById(id)!.style.background = 'var(--primary-color)';
  }
}
