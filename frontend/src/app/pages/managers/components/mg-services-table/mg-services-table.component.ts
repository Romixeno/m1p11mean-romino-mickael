import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ServiceModel } from '../../../../Models/service.model';
import { ServiceService } from '../../../../services/service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'mg-services-table',
  templateUrl: './mg-services-table.component.html',
  styleUrl: './mg-services-table.component.scss',
})
export class MgServicesTableComponent {
  // @Output() addEmployeeClicked: EventEmitter<null> = new EventEmitter<null>();
  // @Input() servicesList: ServiceModel[] = null;
  // onAddEmployeeClicked() {
  //   this.addEmployeeClicked.emit(null);
  // }
  serviceService: ServiceService = inject(ServiceService);
  serviceList: ServiceModel[] = null;
  showFormServices: boolean = false;
  showLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  ngOnInit() {
    this.showLoading = true;
    this.serviceService.getAllServices().subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status == 500) {
          this.errorMessage = 'Internal server error. Please try again later.';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
        this.showLoading = false;
      },
    });
    this.serviceService.ses$.subscribe({
      next: (service: ServiceModel[]) => {
        console.log(service);
        this.serviceList = service;
        this.showLoading = false;
      },
      complete: () => {},
    });
  }

  showForm() {
    this.showFormServices = true;
  }
  closeForm() {
    this.showFormServices = false;
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
}
