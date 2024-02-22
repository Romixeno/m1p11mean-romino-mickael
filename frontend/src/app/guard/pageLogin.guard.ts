import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateLoginPage {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  canActivate(): boolean | UrlTree {
    const userType = this.authService.getUserType();

    if (userType == 'Client' || userType == 'Employee') {
      return this.router.createUrlTree(['/']);
    } else if (userType == 'Manager') {
      return this.router.createUrlTree(['/manager/services']);
    } else {
      return true;
    }
  }
}
