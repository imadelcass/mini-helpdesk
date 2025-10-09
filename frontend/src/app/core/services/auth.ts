import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);

  login(credentials: { email: string; password: string }) {
    this.http.post('login', credentials).subscribe((res: any) => {
      localStorage.setItem('authToken', res.token);
      // window.location.reload();
    });
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  me() {
    this.http.get('me').subscribe((res: any) => {
      this.currentUser.set(res);
      this.isAuthenticated.set(true);
    });
  }

  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
