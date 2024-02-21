import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from '../../../../services/employees.service';

import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeModel } from '../../../../Models/employee.model';
import { Router } from '@angular/router';
import { error } from 'node:console';

@Component({
  selector: 'app-mg-employees-form',
  templateUrl: './mg-employees-form.component.html',
  styleUrl: './mg-employees-form.component.scss',
})
export class MgEmployeesFormComponent {
  formData: FormData;
  router: Router = inject(Router);
  selectedEmployee?: EmployeeModel;
  employeeService: EmployeesService = inject(EmployeesService);
  employeeForm: FormGroup;
  errorMessage?: string;
  imgFile: File;
  isUpdating: boolean = false;
  showLoading: boolean = false;
  file: File;

  imageTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
  ];
  dowList: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedDow: string[] = [];
  ngOnInit(): void {
    this.selectedEmployee = history.state?.employee;
    this.employeeForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      specialty: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      workingHours: new FormArray([
        new FormGroup({
          dayOfWeek: new FormControl(null, Validators.required),
          start: new FormControl(null, Validators.required),
          end: new FormControl(null, Validators.required),
        }),
      ]),
      commission: new FormControl(null, Validators.required),
      image: new FormControl(null),
    });

    if (this.selectedEmployee) {
      this.isUpdating = true;
      const { _id, __v, image, workingHours, ...employeeData } =
        this.selectedEmployee;
      this.employeeForm.patchValue(employeeData);
      (<FormArray>this.employeeForm.get('workingHours')).clear();
      workingHours.forEach((workingHour) => {
        const frmGroup = new FormGroup({
          dayOfWeek: new FormControl(
            workingHour.dayOfWeek,
            Validators.required
          ),
          start: new FormControl(workingHour.start, Validators.required),
          end: new FormControl(workingHour.end, Validators.required),
        });

        (<FormArray>this.employeeForm.get('workingHours')).push(frmGroup);
      });
    } else {
      this.isUpdating = false;
    }
  }

  OnImageChanged(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const selectedFile = inputEl.files[0];
    if (selectedFile && this.imageTypes.includes(selectedFile.type)) {
      this.imgFile = selectedFile;
      console.log(this.imgFile);
    } else {
      this.errorMessage = 'File format invalid';
      setTimeout(() => {
        this.errorMessage = null;
      }, 4000);
    }
  }
  formSubmitOnError(error: HttpErrorResponse) {
    console.error(error);
    this.showLoading = false;
    this.errorMessage = error.error;
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
    this.formData = new FormData();
  }
  OnAddOrUpdate() {}
  onDowChange(event: Event, index: number) {
    const selectEl = event.target as HTMLSelectElement;
    const selectedDay = selectEl.value;

    this.selectedDow[index] = selectedDay;

    this.dowList.forEach((day, idx) => {
      if (idx !== index && this.selectedDow[idx] === selectedDay) {
        this.selectedDow[idx] = null;
      }
    });
  }

  onAddWorkingHours() {
    const frmGroup = new FormGroup({
      dayOfWeek: new FormControl(null, Validators.required),
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required),
    });

    (<FormArray>this.employeeForm.get('workingHours')).push(frmGroup);
  }
  DeleteWorkingHours(index: number) {
    const controls = <FormArray>this.employeeForm.get('workingHours');
    controls.removeAt(index);

    this.selectedDow.splice(index, 1);
  }
  setErrorMessage(err: HttpErrorResponse) {
    console.error(err);
    if (err.error instanceof ErrorEvent) {
      console.error('An error occurred:', err.error.message);
      this.errorMessage = 'An error occurred. Please try again later.';
    } else {
      console.error(
        `Backend returned code ${err.status}, body was: ${err.error}`
      );

      switch (err.status) {
        case 400:
          this.errorMessage = 'Validation error occurred.';
          break;
        case 401:
          this.errorMessage = 'Authentication error occurred.';
          break;
        case 500:
          this.errorMessage = 'Internal server error occurred.';
          break;
        default:
          this.errorMessage = 'An error occurred. Please try again later.';
          break;
      }
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
  }

  appendFormData() {
    Object.keys(this.employeeForm.value).forEach((key) => {
      const control = this.employeeForm.get(key);
      if (key !== 'image' && key !== 'workingHours' && control) {
        this.formData.append(key, control.value);
      } else if (key == 'workingHours' && control) {
        this.formData.append(
          'workingHours',
          JSON.stringify(this.employeeForm.value.workingHours)
        );
      }
    });
  }
  OnSubmit() {
    if (!this.isUpdating) {
      this.showLoading = true;
      this.formData = new FormData();

      if (this.imgFile) {
        this.formData.append('image', this.imgFile);
        this.appendFormData();

        this.employeeService.addEmployee(this.formData).subscribe({
          next: (response: EmployeeModel[]) => {
            // console.log(response);
          },
          error: (err: HttpErrorResponse) => {
            this.showLoading = false;
            this.setErrorMessage(err);
          },

          complete: () => {
            this.showLoading = false;
            this.router.navigateByUrl('/manager/employees');
          },
        });
      }
    } else {
      this.showLoading = true;
      this.formData = new FormData();

      if (this.imgFile) {
        this.formData.append('image', this.imgFile);
      }
      this.appendFormData();

      this.employeeService
        .updateEmployee(this.formData, this.selectedEmployee._id)
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error: HttpErrorResponse) => {
            this.showLoading = false;
            this.setErrorMessage(error);
          },
          complete: () => {
            this.showLoading = false;
            this.router.navigateByUrl('/manager/employees');
          },
        });
    }
  }
}
