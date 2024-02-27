import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
export const employeeGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const userType = authService.getUserType();

  if (!userType || userType === 'Client' || userType === 'Manager') {
    return router.createUrlTree(['/']);
  }
  return true;
};
