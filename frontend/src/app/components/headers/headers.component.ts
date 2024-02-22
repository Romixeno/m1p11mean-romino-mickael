import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../Models/user.model';
import { userType } from '../../Models/userType.type';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeadersComponent implements OnInit {
  router: Router = inject(Router);
  isLoggedIn: boolean = false;
  userType?: userType;
  user;
  private subLoggedIn: Subscription;
  private subUserType: Subscription;
  showDropdown: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isAuthenticated();
    this.subLoggedIn = this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.user = this.authService.getUser();
    });
    this.subUserType = this.authService.userType$.subscribe((userType) => {
      this.userType = userType;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subLoggedIn) {
      this.subLoggedIn.unsubscribe();
    }
    if (this.subUserType) {
      this.subUserType.unsubscribe();
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onLogout() {
    // this.authService.logout().subscribe(() => {
    //   this.user = null;
    // });
    this.authService.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.showDropdown = false;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  onEmployeeLogout() {
    this.authService.logoutEmployee().subscribe({
      next: () => {
        this.router.navigate(['/']);
        this.showDropdown = false;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
