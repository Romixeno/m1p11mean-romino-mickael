import { Component } from '@angular/core';
import { User } from '../../../../Models/user.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-mg-header',
  templateUrl: './mg-header.component.html',
  styleUrl: './mg-header.component.scss',
})
export class MgHeaderComponent {
  isLoggedIn: boolean = false;
  user?: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.user = this.authService.getUser();
      }
    });
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.user = null;
    });
  }
}
