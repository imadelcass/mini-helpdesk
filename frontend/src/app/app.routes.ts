import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { loginGuard } from './core/guards/login-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    canActivate: [loginGuard],
  },
  // Admin users
  {
    path: 'admin',
    loadComponent: () =>
      import('./core/layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'faqs',
        loadComponent: () =>
          import('./features/faq/faq-list-admin/faq-list-admin').then((m) => m.FaqListAdmin),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./features/ticket/ticket-list-admin/ticket-list-admin').then(
            (m) => m.TicketListAdmin
          ),
      },
    ],
  },
  // Normal users
  {
    path: '',
    loadComponent: () => import('./core/layouts/app-layout/app-layout').then((m) => m.AppLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'tickets',
        pathMatch: 'full',
      },
      {
        path: 'faqs',
        loadComponent: () =>
          import('./features/faq/faq-list-public/faq-list-public').then((m) => m.FaqListPublic),
      },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./features/ticket/ticket-list-public/ticket-list-public').then(
            (m) => m.TicketListPublic
          ),
      },
    ],
  },
];
