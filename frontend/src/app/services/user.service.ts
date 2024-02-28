import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:3001';
  verifyClientId(id: string) {
    return this.http.get(`${this.baseUrl}/client/profile/${id}`);
  }

  updateClient(id: string, formData: FormData) {
    return this.http.patch(`${this.baseUrl}/client/update/${id}`, formData);
  }

  updatePassword(body: any, id: string) {
    return this.http.patch(
      `${this.baseUrl}/client/update/password/${id}`,
      body
    );
  }

  getClientPreferences(clientId: string) {
    return this.http.get(`${this.baseUrl}/preferences/${clientId}`);
  }

  addRemoveEmployeePreference(clientId: string, employeeId: string) {
    return this.http.post(
      `${this.baseUrl}/addRemoveEmployeePreference/${clientId}`,
      { employeeId: employeeId }
    );
  }

  addRemoveServicePreference(clientId: string, serviceId: string) {
    return this.http.post(
      `${this.baseUrl}/addRemoveServicePreference/${clientId}`,
      { serviceId: serviceId }
    );
  }
  constructor() {}
}
