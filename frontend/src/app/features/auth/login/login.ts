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
  email = signal('admin@yourdomain.com');
  password = signal('00000000');
  loading = signal(false);
  error = signal('');

  constructor(private auth: Auth, private router: Router) {}

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
