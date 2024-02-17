import { Component, inject } from '@angular/core';
import { ServiceService } from '../../../services/service.service';
import { ServiceModel } from '../../../Models/service.model';

@Component({
  selector: 'app-mg-services-page',
  templateUrl: './mg-services-page.component.html',
  styleUrl: './mg-services-page.component.scss',
})
export class MgServicesPageComponent {
  // serviceService: ServiceService = inject(ServiceService);
  // serviceList: ServiceModel[] = null;
  // showFormServices: boolean = false;
  // ngOnInit() {
  //   this.serviceService.getAllServices();
  //   this.serviceService.services$.subscribe((service) => {
  //     this.serviceList = service;
  //     console.log(this.serviceList);
  //   });
  // }
  // showForm() {
  //   this.showFormServices = true;
  // }
  // closeForm() {
  //   this.showFormServices = false;
  // }
}
