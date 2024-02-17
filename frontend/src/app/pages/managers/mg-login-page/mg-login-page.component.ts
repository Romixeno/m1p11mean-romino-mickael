import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mg-login-page',
  templateUrl: './mg-login-page.component.html',
  styleUrl: './mg-login-page.component.scss',
})
export class MgLoginPageComponent {
  router: Router = inject(Router);
  mgForm: FormGroup;
  message: any | null;
  authService: AuthService = inject(AuthService);
  ngOnInit() {
    this.mgForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  mgSubmit() {
    console.log(this.mgForm.value);
    this.authService.login(this.mgForm.value).subscribe({
      next: (response: any) => {
        const user = response.user;
        const { password, __v, ...other } = user;
        this.authService.setUser(other);
        if (user.userType == 'Manager') {
          this.router.navigateByUrl('/manager/services');
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', err.error.message);
          this.message = 'An error occurred. Please try again later.';
        } else {
          if (err.status === 401) {
            this.message = 'Invalid email or password. Please try again.';
          } else if (err.status === 500) {
            this.message = 'Internal server error. Please try again later.';
          } else {
            this.message = 'An error occurred. Please try again later.';
          }
          console.error(
            `Backend returned code ${err.status}, ` + `body was: ${err.error}`
          );
        }
        setTimeout(() => {
          this.message = null;
        }, 4000);
      },
      complete: () => {},
    });
  }
}
