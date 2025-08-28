import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.authState$.pipe(
    take(1),
    map((state) => {
      if (state.isAuthenticated) {
        return true;
      } else {
        router.navigate(['/auth']);
        return false;
      }
    })
  );
};
