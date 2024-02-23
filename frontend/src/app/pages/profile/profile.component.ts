import { Component, inject } from '@angular/core';
import { userType } from '../../Models/userType.type';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  userType: userType;
  authService: AuthService = inject(AuthService);
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.userType = this.authService.getUserType();
  }
}
