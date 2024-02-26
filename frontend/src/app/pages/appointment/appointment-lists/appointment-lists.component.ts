import { Component, inject } from '@angular/core';
import { AppointmentModel } from '../../../Models/appointment.model';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-appointment-lists',
  templateUrl: './appointment-lists.component.html',
  styleUrl: './appointment-lists.component.scss',
})
export class AppointmentListsComponent {
  appointmentList: AppointmentModel[];
  appointmentService: AppointmentService = inject(AppointmentService);
  authService: AuthService = inject(AuthService);
  serviceService: ServiceService = inject(ServiceService);

  columnToDisplay: string[] = [
    'No',
    'services',
    'totalPrice',
    'totalDuration',
    'date',
  ];
  ngOnInit(): void {
    const user = this.authService.getUser();

    this.appointmentService.getClientAppointment(user._id).subscribe({
      next: (response: AppointmentModel[]) => {
        this.appointmentList = response;
        const newDate = new Date(this.appointmentList[0].dateTime);
        console.log(response);
        // Object.keys(this.appointmentList[0]).forEach((key) => {
        //   console.log(key);
        // });
      },
      error: (error) => {},
    });
  }
}
