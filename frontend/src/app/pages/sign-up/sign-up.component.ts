import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CustomValidator } from '../../validators/passwordValidator';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../Models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  message: any | null;
  signupForm: FormGroup;
  formStatus: string = '';
  showLoader: boolean = false;
  authService = inject(AuthService);
  router = inject(Router);
  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.required,
        CustomValidator.emailFormat,
      ]),
      phoneNumber: new FormControl(null, Validators.required),
      // password: new FormControl(null, Validators.required),
      // confirmPassword: new FormControl(null),
      pass: new FormGroup(
        {
          password: new FormControl(null, Validators.required),
          confirmPassword: new FormControl(null, Validators.required),
        },
        { validators: CustomValidator.passwordMatch }
      ),
    });

    this.signupForm.statusChanges.subscribe((status) => {
      this.formStatus = status;
    });
  }

  ngAfterViewInit() {
    // this.router.navigate(['/login'], {
    //   queryParams: { signup: 'successfull' },
    // });
  }

  onSubmit() {
    this.showLoader = true;
    let { pass, ...other } = this.signupForm.value;

    const body = { ...other, ...pass };
    console.log(body);
    this.authService.signUp(body).subscribe({
      next: (response: User) => {
        console.log(response);
        this.router.navigate(['/login'], {
          state: {
            signup: 'Your account has been created successfully',
            email: response.email,
          },
        });
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
      complete: () => {
        this.showLoader = false;
      },
    });
  }
}
