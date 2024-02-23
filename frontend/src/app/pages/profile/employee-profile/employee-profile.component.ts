import { Component, inject } from '@angular/core';
import { EmployeeModel } from '../../../Models/employee.model';
import { EmployeesService } from '../../../services/employees.service';
import { AuthService } from '../../../services/auth.service';
import { FormGroup } from '@angular/forms';

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
