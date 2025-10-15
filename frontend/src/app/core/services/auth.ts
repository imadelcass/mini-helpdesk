import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RolesEnum } from '@shared/enums/roles';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);

  isAdmin(): boolean {
    return this.currentUser().role == RolesEnum.ADMIN;
  }

  isAgent(): boolean {
    return this.currentUser().role == RolesEnum.AGENT;
  }

  isUser(): boolean {
    return this.currentUser().role == RolesEnum.USER;
  }


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
      window.location.reload();
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
