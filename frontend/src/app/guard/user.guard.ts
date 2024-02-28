import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
export const userGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const userType = authService.getUserType();

  if (!userType || userType === 'Employee' || userType === 'Manager') {
    return router.createUrlTree(['/']);
  }
  return true;
};
