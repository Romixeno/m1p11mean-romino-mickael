import { Component, OnDestroy, inject } from '@angular/core';
import { ServiceModel } from '../../../../Models/service.model';
import { ServiceService } from '../../../../services/service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mg-services-table',
  templateUrl: './mg-services-table.component.html',
  styleUrls: ['./mg-services-table.component.scss'],
})
export class MgServicesTableComponent implements OnDestroy {
  serviceService: ServiceService = inject(ServiceService);
  serviceList: ServiceModel[] = null;
  selectedService: ServiceModel = null;
  isEditMode: boolean = false;
  showFormServices: boolean = false;
  showLoading: boolean = false;
  showConfirmation: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  private subscription: Subscription;

  ngOnInit() {
    this.showLoading = true;
    this.getServices();
    this.subscription = this.serviceService.ses$.subscribe({
      next: (service: ServiceModel[]) => {
        console.log(service);
        this.serviceList = service;
        this.showLoading = false;
      },
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showForm() {
    this.showFormServices = true;
  }

  closeForm() {
    this.showFormServices = false;
    if (this.isEditMode) {
      this.isEditMode = false;
      this.selectedService = null;
    }
  }

  onRefresh() {
    this.showLoading = true;
    this.getServices();
  }

  getServices() {
    this.serviceService.getAllServices().subscribe({
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          err.status == 500
            ? 'Internal server error. Please try again later.'
            : 'An error occurred. Please try again later.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
        this.showLoading = false;
      },
    });
  }
  showUpdateForm(service: ServiceModel) {
    this.isEditMode = true;
    this.selectedService = service;
    this.showForm();
  }
  toggleConfirmModal(service?: ServiceModel) {
    this.selectedService = service ? service : null;
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
    const serviceId = this.selectedService._id;
    this.serviceService.deleteService(serviceId).subscribe({
      next: () => {
        this.getServices();
        this.toggleConfirmModal();
        this.setSuccessMessage('Service has been deleted successfully');
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error;
        setTimeout(() => {
          this.errorMessage = null;
        }, 4000);
      },
    });
    console.log(this.selectedService._id);
  }
}
