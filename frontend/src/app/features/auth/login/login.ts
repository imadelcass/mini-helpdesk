import { Component, signal } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ButtonModule],
  templateUrl: './login.html',
})
export class Login {
  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal('');

  constructor(private auth: Auth, private router: Router) {}

  dummyUsers = [
    { email: 'admin@yourdomain.com', password: '00000000', role: 'Admin' },
    { email: 'agent@yourdomain.com', password: '00000000', role: 'Agent' },
    { email: 'user@yourdomain.com', password: '00000000', role: 'User' },
  ];

  fillCredentials(email: string, password: string) {
    this.email.set(email);
    this.password.set(password);
  }

  onSubmit(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth
      .login({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => window.location.reload(),
        error: (err) => {
          this.error.set(err.error?.message || 'Login failed');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }
}
