import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidator } from '../../validators/passwordValidator';
import { User } from '../../Models/user.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  // ---------------------------------------
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  location: Location = inject(Location);
  authService: AuthService = inject(AuthService);
  // ---------------------------------------
  message: any | null;
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        CustomValidator.emailFormat,
      ]),
      password: new FormControl(null, Validators.required),
    });

    this.message = this.location.getState();
    if (this.message?.email) {
      this.loginForm.patchValue({ email: this.message?.email });
    }
    setTimeout(() => {
      this.message = null;
    }, 4000);

    // this.activeRoute.queryParamMap.subscribe((queries) => {
    //   const logout = Boolean(queries.get('logout'));
    //   if (logout) {
    //     this.authService.logout();
    //   }
    // });
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        const user = response.user;
        const { password, __v, ...other } = user;
        this.authService.setUser(other);
        console.log('ok');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.message = {
            error: 'Invalid email or password. Please try again.',
          };
        } else if (err.status === 403) {
          this.message = { error: 'Access forbidden. Please contact support.' };
        } else if (err.status === 404) {
          this.message = {
            error: 'Resource not found. Please try again later.',
          };
        } else if (err.status === 500) {
          this.message = {
            error: 'Internal server error. Please try again later.',
          };
        } else if (err.error.error) {
          this.message = { error: err.error.error };
        } else {
          this.message = {
            error: 'An error occurred. Please try again later.',
          };
        }
        setTimeout(() => {
          this.message = null;
        }, 4000);
      },
      complete: () => {},
    });
  }
}
