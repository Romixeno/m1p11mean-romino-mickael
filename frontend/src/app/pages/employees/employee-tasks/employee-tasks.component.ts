import { Component, inject } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { AppointmentModel } from '../../../Models/appointment.model';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrl: './employee-tasks.component.scss',
})
export class EmployeeTasksComponent {
  tasksList: AppointmentModel[];
  appointmentService: AppointmentService = inject(AppointmentService);
  authService: AuthService = inject(AuthService);
  columToDisplay = ['No.', 'Client', 'Services', 'Duration', 'Date', 'Status'];
  ngOnInit(): void {
    const user = this.authService.getUser();

    this.appointmentService.getEmployeeTasks(user._id).subscribe({
      next: (response: AppointmentModel[]) => {
        this.tasksList = response;
        console.log(this.tasksList);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
