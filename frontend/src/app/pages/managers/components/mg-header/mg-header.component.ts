import { Component, Input, inject } from '@angular/core';
import { User } from '../../../../Models/user.model';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mg-header',
  templateUrl: './mg-header.component.html',
  styleUrl: './mg-header.component.scss',
})
export class MgHeaderComponent {
  isLoggedIn: boolean = false;
  router: Router = inject(Router);
  @Input() user: User = null;
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogout() {
    this.authService.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {},
    });
  }
}
