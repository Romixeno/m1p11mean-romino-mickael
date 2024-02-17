import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ServiceModel } from '../../../../Models/service.model';
import { ServiceService } from '../../../../services/service.service';

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
  ngOnInit() {
    this.showLoading = true;
    this.serviceService.getAllServices();
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
}
