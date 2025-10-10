import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('login', credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('authToken', res.token);
        return res;
      }),
      catchError((error) => throwError(() => error))
    );
  }

  logout() {
    return this.http.post('logout', {}).pipe((res: any) => {
      localStorage.removeItem('authToken');
      this.isAuthenticated.set(false);
      this.currentUser.set(null);
      return res;
    });
  }

  me(): Observable<any> {
    return this.http.get('me').pipe(
      tap((user: any) => {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        return user;
      }),
      catchError((error) => {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        return throwError(() => error);
      })
    );
  }

  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}
