import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppointmentModel } from '../Models/appointment.model';
import { httpUrl } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  http: HttpClient = inject(HttpClient);
  // baseUrl = 'http://localhost:3001/appointment';
  newAppointment(data: AppointmentModel) {
    return this.http.post(`${httpUrl}/new`, data);
  }

  getClientAppointment(id: string) {
    return this.http.get(`${httpUrl}/client/${id}`);
  }

  getEmployeeTasks(employeeId: string) {
    return this.http.get(`${httpUrl}/employee/${employeeId}`);
  }
}
