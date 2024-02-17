import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../Models/user.model';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss'],
})
export class HeadersComponent implements OnInit {
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
