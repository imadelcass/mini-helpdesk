import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { catchError, tap, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.me().pipe(
    tap(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
