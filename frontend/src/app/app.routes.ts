import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { loginGuard } from './core/guards/login-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
    canActivate: [loginGuard],
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'faqs',
        pathMatch: 'full',
      },
      {
        path: 'faqs',
        loadComponent: () => import('./features/faq/faq-list/faq-list').then((m) => m.FaqList),
      },
    ],
  },
];
