import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const onlyConnectedGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const userType = authService.getUserType();
  if (!userType) {
    return router.createUrlTree(['/']);
  }
  return true;
};
