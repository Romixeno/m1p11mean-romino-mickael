import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  ServiceModel,
  ServiceModelWithSelected,
} from '../../Models/service.model';
import { ServiceService } from '../../services/service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeesService } from '../../services/employees.service';
import { EmployeeModel } from '../../Models/employee.model';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentModel } from '../../Models/appointment.model';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(100%)' })
        ),
      ]),
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppointmentComponent implements OnInit {
  servicesList: ServiceModel[] = [];
  employeeList: EmployeeModel[] = [];
  servicesType: string[] = ['Hair', 'Makeup', 'Nail', 'Skin'];
  transformedService: ServiceModelWithSelected[];
  selectedId?: string;
  selectedType: string;
  selectedEmployees: { [key: string]: string } = {};
  errors: { [key: string]: string } = {};
  dateTest: any;
  min = new Date(Date.now());
  errorMessage?: string;

  constructor(
    private serviceService: ServiceService,
    private employeeService: EmployeesService,
    private authService: AuthService,
    private userService: UserService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const { serviceId, serviceType } = history.state;

    this.serviceService.getAllServices().subscribe({
      next: (response: ServiceModel[]) => {
        this.servicesList = response;
        this.transformedService = this.servicesList.map((service) => {
          return { ...service, selected: false };
        });
        if (serviceId && serviceType) {
          this.selectedId = serviceId;
          this.selectedType = serviceType;
          this.setSelected(this.selectedId);
        }
      },
      error: (error: HttpErrorResponse) => {},
    });

    this.employeeService.getAllEmployee().subscribe({
      next: (response: EmployeeModel[]) => {
        this.employeeList = response;
      },
      error: (error: HttpErrorResponse) => {},
    });
  }

  checkChange(event: Event) {
    console.log(this.dateTest);
  }

  setSelected(index: string, type?: string) {
    const service = this.transformedService.find((s) => s._id === index);
    if (service) {
      service.selected = !service.selected;
    }
    if (!this.hasSomeSelected(type)) {
      delete this.selectedEmployees[type];
      if (this.errors[type]) {
        delete this.errors[type];
      }
    }
  }

  hasSomeValue(type: string): boolean {
    return this.transformedService?.some((service) => service.type == type);
  }

  hasSomeSelected(type: string): boolean {
    return this.transformedService?.some(
      (service) => service.type === type && service.selected
    );
  }

  getServicesForType(type: string): ServiceModelWithSelected[] {
    return this.transformedService?.filter((service) => service.type === type);
  }

  getSelectedServicesLength(): number {
    return this.transformedService?.filter((service) => service.selected)
      .length;
  }

  getTotalPrice(): number {
    return this.transformedService
      ?.filter((service) => service.selected)
      .reduce((total, service) => total + service.price, 0);
  }

  getTotalDuration(): number {
    return this.transformedService
      ?.filter((service) => service.selected)
      .reduce((total, service) => total + service.duration, 0);
  }

  makeAppointmentClicked() {
    this.errors = this.verifyEmployeeSelection();

    if (Object.keys(this.errors).length > 0) {
      console.log('Errors:', this.errors);
      return;
    }

    const selectedServicesByType = {};

    this.transformedService.forEach((service) => {
      if (service.selected) {
        if (!selectedServicesByType[service.type]) {
          selectedServicesByType[service.type] = [];
        }
        selectedServicesByType[service.type].push(service._id);
      }
    });
    console.log(selectedServicesByType);

    const selectedServices = Object.keys(selectedServicesByType).map(
      (serviceType) => ({
        serviceType,
        employeeId: this.selectedEmployees[serviceType],
        serviceIds: selectedServicesByType[serviceType],
      })
    );

    console.log(selectedServices);
    const user = this.authService.getUser();
    this.userService.verifyClientId(user._id).subscribe({
      next: (response) => {
        const data: AppointmentModel = {
          clientId: user._id,
          services: selectedServices,
          totalPrice: this.getTotalPrice(),
          totalDuration: this.getTotalDuration(),
          dateTime: this.dateTest,
        };
        this.appointmentService.newAppointment(data).subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (error: HttpErrorResponse) => {},
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 404) {
          this.errorMessage = 'Not allow to make appointment';
        }
      },
    });
  }

  onEmployeeSelectionChange(type: string, event) {
    console.log(event.value);
    this.selectedEmployees[type] = event.value;
  }

  verifyEmployeeSelection(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    this.servicesType.forEach((type) => {
      if (this.hasSomeSelected(type) && !this.selectedEmployees[type]) {
        errors[type] = `You have to select an employee for the service ${type}`;
      }
    });

    return errors;
  }

  canExit(): boolean {
    if (this.getSelectedServicesLength() > 0) {
      return confirm('You have unsaved changes. Do you want to navigate away?');
    } else {
      return true;
    }
  }

  onCancel() {
    this.transformedService.forEach((service) => {
      if (service.selected) {
        service.selected = false;
        this.selectedId = null;
        this.selectedType = null;
      }
    });
  }
}
