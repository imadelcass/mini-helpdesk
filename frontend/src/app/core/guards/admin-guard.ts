import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { catchError, tap, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.me().pipe(
    tap(() => {
      console.log("adminGuard", auth.isAdmin(), auth.currentUser());
      
      if (!auth.isAdmin()) {
        router.navigate(['/']);
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
