import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EmployeeModel } from '../../Models/employee.model';
import { ServiceModel } from '../../Models/service.model';
import { ServiceService } from '../../services/service.service';
import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  searchFor: string = 'service';
  router: Router = inject(Router);
  employeeList: EmployeeModel[];
  serviceList: ServiceModel[];
  serviceService: ServiceService = inject(ServiceService);
  employeeService: EmployeesService = inject(EmployeesService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  searchedText: string = '';
  searchResultText: string;
  noResult: boolean = false;
  showLoading: boolean = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.activatedRoute.queryParams.subscribe((response: any) => {
      if (response.employee == '' || response.employee) {
        this.searchFor = 'employee';
        this.serviceList = null;
      }
      if (response.service == '' || response.service) {
        this.searchFor = 'service';
        this.employeeList = null;
      }

      if (response.q !== '' && response.q) {
        this.showLoading = true;
        this.searchedText = response.q;
        this.searchResultText = response.q;
        if (this.searchFor == 'service') {
          const query = {
            q: response.q,
            filterBy: 'All',
          };
          this.serviceService.searchService(query).subscribe({
            next: (response: ServiceModel[]) => {
              this.serviceList = response;
              this.showLoading = false;
              if (this.serviceList.length == 0) {
                this.noResult = true;
              } else {
                this.noResult = false;
              }
            },
            error: (error) => {
              console.error(error);
            },
          });
        } else if (this.searchFor == 'employee') {
          this.employeeService.searchEmployee(response.q).subscribe({
            next: (response: EmployeeModel[]) => {
              this.employeeList = response;
              this.showLoading = false;
              if (this.employeeList.length == 0) {
                this.noResult = true;
              } else {
                this.noResult = false;
              }
            },
            error: (error) => {
              console.error(error);
            },
          });
        }
      } else {
      }
    });
  }

  btnSearchClicked() {
    // const input = this.searchInput.nativeElement as HTMLInputElement;

    // this.searchedText = input.value;
    if (this.searchedText == '' || !this.searchedText) {
      return;
    }
    const queryParams = {
      [this.searchFor]: '',
      q: this.searchedText,
    };

    const navigationExtras: NavigationExtras = {
      queryParams,
    };

    this.router.navigate(['/search'], navigationExtras);
  }
}
