import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employees.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmployeeModel } from '../../../Models/employee.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-login-page',
  templateUrl: './employee-login-page.component.html',
  styleUrl: './employee-login-page.component.scss',
})
export class EmployeeLoginPageComponent {
  employeeForm: FormGroup;
  errorMessage: any | null;
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  employeeService: EmployeesService = inject(EmployeesService);
  ngOnInit() {
    this.employeeForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  setErrorMessage(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.errorMessage = {
        error: 'Invalid email or password. Please try again.',
      };
    } else if (err.status === 403) {
      this.errorMessage = {
        error: 'Access forbidden. Please contact support.',
      };
    } else if (err.status === 404) {
      this.errorMessage = {
        error: 'Resource not found. Please try again later.',
      };
    } else if (err.status === 500) {
      this.errorMessage = {
        error: 'Internal server error. Please try again later.',
      };
    } else if (err.error.error) {
      this.errorMessage = { error: err.error.error };
    } else {
      this.errorMessage = {
        error: 'An error occurred. Please try again later.',
      };
    }
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }
  onSubmit() {
    this.authService.loginEmployee(this.employeeForm.value).subscribe({
      next: (employee: EmployeeModel) => {
        this.router.navigate(['/employee/myTasks']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.setErrorMessage(err);
      },
    });
  }
}
