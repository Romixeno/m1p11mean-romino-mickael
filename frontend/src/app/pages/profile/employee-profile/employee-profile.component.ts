import { Component, inject } from '@angular/core';
import { EmployeeModel } from '../../../Models/employee.model';
import { EmployeesService } from '../../../services/employees.service';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomValidator } from '../../../validators/passwordValidator';
import { animate, style, transition, trigger } from '@angular/animations';
import { httpUrl } from '../../../utils/utils';

@Component({
  selector: 'employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class EmployeeProfileComponent {
  showPasswordForm: boolean = false;
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
  baseUrl: string = httpUrl;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.showLoading = true;
    const employee = this.authService.getUser();
    this.employeeService.getEmployeeById(employee._id).subscribe({
      next: (response: EmployeeModel) => {
        this.employee = response;
        console.log(response);
        this.profileForm = this.resetFormGroup();
        this.showLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.showLoading = false;
        console.error(error);
      },
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
  setSuccessMessage(message: string) {
    (this.successMessage = message),
      setTimeout(() => {
        this.successMessage = null;
      }, 4000);
  }
  UpdateInfo(event: Event) {
    event.preventDefault();
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.profileForm = this.resetFormGroup();
    }
  }

  updateEmployee(formData: FormData) {
    this.employeeService.updateEmployee(formData, this.employee._id).subscribe({
      next: (response: EmployeeModel) => {
        this.employee = response;
        const { _id, image, userType, ...other } = this.employee;
        this.authService.setUser({
          _id: _id,
          userType: userType,
          image: image,
        });
        this.authService.isAuthenticated();
        this.isEditMode = false;
        this.resetFormGroup();
        this.setSuccessMessage('Your account has been updated successfully');
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
  onUpdate() {
    const updatedEmployee = {
      firstName: this.profileForm.get('firstName').value,
      lastName: this.profileForm.get('lastName').value,
      email: this.profileForm.get('email').value,
      phoneNumber: this.profileForm.get('phoneNumber').value,
    };

    if (
      updatedEmployee.firstName === this.employee.firstName &&
      updatedEmployee.lastName === this.employee.lastName &&
      updatedEmployee.email === this.employee.email &&
      updatedEmployee.phoneNumber === this.employee.phoneNumber
    ) {
      // make an update if there is a image
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        this.updateEmployee(formData);
      }
      return;
    }

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const formValues = this.profileForm.value;
    Object.keys(formValues).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, formValues[key]);
      }
    });

    this.updateEmployee(formData);
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }
}
