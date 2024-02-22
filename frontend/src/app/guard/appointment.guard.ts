import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const appointmentGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const userType = authService.getUserType();
  if (!userType || userType === 'Manager' || userType === 'Employee') {
    return router.createUrlTree(['/login']);
  }
  return true;
};
