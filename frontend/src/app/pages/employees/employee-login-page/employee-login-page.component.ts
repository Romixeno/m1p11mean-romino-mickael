import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { EmployeesService } from '../../../services/employees.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EmployeeModel } from '../../../Models/employee.model';

@Component({
  selector: 'app-employee-login-page',
  templateUrl: './employee-login-page.component.html',
  styleUrl: './employee-login-page.component.scss',
})
export class EmployeeLoginPageComponent {
  employeeForm: FormGroup;
  errorMessage: any | null;
  authService: AuthService = inject(AuthService);
  employeeService: EmployeesService = inject(EmployeesService);
  ngOnInit() {
    this.employeeForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    this.authService.loginEmployee(this.employeeForm.value).subscribe({
      next: (employee: EmployeeModel) => {},
      error: (err: HttpErrorResponse) => {},
    });
  }
}
