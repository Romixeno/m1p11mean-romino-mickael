import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmployeesService } from '../../../../services/employees.service';
import { EmployeeModel } from '../../../../Models/employee.model';
import { httpUrl } from '../../../../utils/utils';

@Component({
  selector: 'mg-employees-table',
  templateUrl: './mg-employees-table.component.html',
  styleUrl: './mg-employees-table.component.scss',
})
export class MgEmployeesTableComponent {
  employeeService: EmployeesService = inject(EmployeesService);
  employeesList: EmployeeModel[] = null;
  selectedEmployee: EmployeeModel = null;
  isEditMode: boolean = false;
  showFormEmployees: boolean = false;
  showLoading: boolean = false;
  showConfirmation: boolean = false;
  errorMessage: string = '';
  successMessage: any;
  private subscription: Subscription;
  baseUrl = httpUrl;
  ngOnInit() {
    this.showLoading = true;
    this.getEmployees();
    this.subscription = this.employeeService.Employee$.subscribe(
      (employees: EmployeeModel[]) => {
        this.employeesList = employees;
        this.showLoading = false;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showForm() {
    this.showFormEmployees = true;
  }

  closeForm() {
    this.showFormEmployees = false;
    if (this.isEditMode) {
      this.isEditMode = false;
      // this.selectedEmployee = null;
    }
  }

  onRefresh() {
    this.showLoading = true;
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getAllEmployee().subscribe({
      error: (err: HttpErrorResponse) => {
        this.showLoading = false;
        if (err.error instanceof ErrorEvent) {
          console.error('An error occurred:', err.error.message);
          this.errorMessage = 'An error occurred. Please try again later.';
        } else {
          if (err.status == 500) {
            this.errorMessage = 'Internal server error occurred.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
        setTimeout(() => {
          this.errorMessage = null;
        }, 4000);
      },
    });
  }
  showUpdateForm(employee: EmployeeModel) {
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.showForm();
  }
  toggleConfirmModal(employee?: EmployeeModel) {
    this.selectedEmployee = employee ? employee : null;
    this.showConfirmation = !this.showConfirmation;
  }

  setLoadingToTrue(val: boolean) {
    this.showLoading = val;
  }

  setSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 4000);
  }

  onDeleteBtnConfirmed() {
    const employeeId = this.selectedEmployee._id;
    // this.serviceService.deleteService(serviceId).subscribe({
    //   next: () => {
    //     this.getEmployees();
    //     this.toggleConfirmModal();
    //     this.setSuccessMessage('Service has been deleted successfully');
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.errorMessage = err.error;
    //     setTimeout(() => {
    //       this.errorMessage = null;
    //     }, 4000);
    //   },
    // });
    // console.log(this.selectedEmployee._id);
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.getEmployees();
        this.toggleConfirmModal();
        this.setSuccessMessage('Employee has been deleted successfully');
      },
      error: (err: HttpErrorResponse) => {
        if (err.error instanceof ErrorEvent) {
          console.error('An error occurred:', err.error.message);
          this.errorMessage = 'An error occurred. Please try again later.';
        } else {
          if (err.status == 500) {
            this.errorMessage = 'Internal server error occurred.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
        }
      },
    });
  }
}
