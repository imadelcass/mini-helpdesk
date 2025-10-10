import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';
import { catchError, tap, of } from 'rxjs';
export const loginGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.me().pipe(
    tap(() => {
      router.navigate(['/']);
      return false;
    }),
    catchError(() => of(true))
  );
};
