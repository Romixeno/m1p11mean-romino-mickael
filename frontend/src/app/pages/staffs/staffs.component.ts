import { Component, inject } from '@angular/core';
import { EmployeeModel } from '../../Models/employee.model';
import { EmployeesService } from '../../services/employees.service';
import { response } from 'express';
import { ServiceService } from '../../services/service.service';
import { ServiceTypeModel } from '../../Models/serviceType.model';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-staffs',
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.scss',
})
export class StaffsComponent {
  employeeList: EmployeeModel[] = [];
  serviceTypeList: ServiceTypeModel[] = [];
  router: Router = inject(Router);
  employeeService: EmployeesService = inject(EmployeesService);
  serviceService: ServiceService = inject(ServiceService);
  searchedText: string = '';
  selectedCategory: string = 'Hair';
  showLoading: boolean = false;
  errorMessage: string;
  ngOnInit(): void {
    this.showLoading = true;
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.serviceService.getAllServicesTypes().subscribe({
      next: (response: ServiceTypeModel[]) => {
        this.serviceTypeList = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.employeeService
      .getEmployeeBySpecialty(this.selectedCategory)
      .subscribe({
        next: (response: EmployeeModel[]) => {
          this.employeeList = response;
          console.log(response);
          this.showLoading = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
    // this.employeeService.getAllEmployee().subscribe({
    //   next: (response: EmployeeModel[]) => {
    //     this.employeeList = response;

    //     this.showLoading = false;
    //   },
    //   error: (error) => {},
    // });
  }

  searchBtnClicked() {
    if (
      this.searchedText == '' ||
      this.searchedText == null ||
      this.searchedText == undefined
    ) {
      return;
    }

    const queryParams: any = {
      employee: '',
      q: this.searchedText,
    };
    const navigationExtras: NavigationExtras = {
      queryParams,
    };

    this.router.navigate(['/search'], navigationExtras);
  }
  onCategoryChange(event: Event) {
    this.showLoading = true;
    this.employeeService
      .getEmployeeBySpecialty(this.selectedCategory)
      .subscribe({
        next: (response: EmployeeModel[]) => {
          this.employeeList = response;
          console.log(response);
          this.showLoading = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
