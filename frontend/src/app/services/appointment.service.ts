import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AppointmentModel } from '../Models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  http: HttpClient = inject(HttpClient);
  baseUrl = 'http://localhost:3001';
  newAppointment(data: AppointmentModel) {
    return this.http.post(`${this.baseUrl}/appointment/new`, data);
  }
}
