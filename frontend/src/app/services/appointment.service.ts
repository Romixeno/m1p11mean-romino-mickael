import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppointmentModel } from '../Models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  http: HttpClient = inject(HttpClient);
  baseUrl = 'http://localhost:3001/appointment';
  newAppointment(data: AppointmentModel) {
    return this.http.post(`${this.baseUrl}/new`, data);
  }

  getClientAppointment(id: string) {
    return this.http.get(`${this.baseUrl}/client/${id}`);
  }

  getEmployeeTasks(employeeId: string) {
    return this.http.get(`${this.baseUrl}/employee/${employeeId}`);
  }
}
