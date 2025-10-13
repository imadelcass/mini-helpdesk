import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, MenuModule, AvatarModule, RouterLink, CommonModule],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  constructor(public router: Router) {}

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
    },
    {
      separator: true,
    },
    {
      label: 'FAQ Management',
      icon: 'pi pi-question-circle',
      routerLink: '/admin/faqs',
    },
    {
      label: 'Ticket Management',
      icon: 'pi pi-ticket',
      routerLink: '/admin/tickets',
    },
  ];
}
