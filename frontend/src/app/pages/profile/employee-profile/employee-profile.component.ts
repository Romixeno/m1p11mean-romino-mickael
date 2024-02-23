import { Component, inject } from '@angular/core';
import { EmployeeModel } from '../../../Models/employee.model';
import { EmployeesService } from '../../../services/employees.service';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidator } from '../../../validators/passwordValidator';

@Component({
  selector: 'employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss',
})
export class EmployeeProfileComponent {
  showLoading: boolean = false;
  isEditMode: boolean = false;
  employee: EmployeeModel;
  employeeService: EmployeesService = inject(EmployeesService);
  authService: AuthService = inject(AuthService);
  profileForm: FormGroup;
  selectedFile: File | null = null;
  successMessage: string;
  errorMessage: string;
  imgUrl: string;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const employee = this.authService.getUser();
    this.employeeService.getEmployeeById(employee._id).subscribe({
      next: (response: EmployeeModel) => {
        this.employee = response;
        console.log(response);
        this.profileForm = this.resetFormGroup();
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
  resetFormGroup(): FormGroup {
    return new FormGroup({
      firstName: new FormControl(this.employee.firstName, Validators.required),
      lastName: new FormControl(this.employee.lastName, Validators.required),
      email: new FormControl(this.employee.email, [
        Validators.required,
        CustomValidator.emailFormat,
      ]),
      phoneNumber: new FormControl(
        this.employee.phoneNumber,
        Validators.required
      ),
      // password: new FormControl(null, Validators.required),
      // confirmPassword: new FormControl(null),
    });
  }
  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgUrl = e.target.result as string;
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      this.imgUrl = null; // Reset imgUrl if no file selected
    }
  }
  UpdateInfo(event: Event) {
    event.preventDefault();
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // this.profileForm = this.resetFormGroup();
    }
  }

  onUpdate() {}
}
