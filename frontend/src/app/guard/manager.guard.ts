import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateManager {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  canActivate(): boolean | UrlTree {
    const userType = this.authService.getUserType();

    if (!userType || userType === 'Client' || userType === 'Employee') {
      return this.router.createUrlTree(['/']);
    }
    return true;
  }
}
