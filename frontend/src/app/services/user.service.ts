import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { httpUrl } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http: HttpClient = inject(HttpClient);

  verifyClientId(id: string) {
    return this.http.get(`${httpUrl}/client/profile/${id}`);
  }

  updateClient(id: string, formData: FormData) {
    return this.http.patch(`${httpUrl}/client/update/${id}`, formData);
  }

  updatePassword(body: any, id: string) {
    return this.http.patch(`${httpUrl}/client/update/password/${id}`, body);
  }

  getClientPreferences(clientId: string) {
    return this.http.get(`${httpUrl}/preferences/${clientId}`);
  }

  addRemoveEmployeePreference(clientId: string, employeeId: string) {
    return this.http.post(
      `${httpUrl}/addRemoveEmployeePreference/${clientId}`,
      { employeeId: employeeId }
    );
  }

  addRemoveServicePreference(clientId: string, serviceId: string) {
    return this.http.post(`${httpUrl}/addRemoveServicePreference/${clientId}`, {
      serviceId: serviceId,
    });
  }

  getPreferencePopulated(clientId: string) {
    return this.http.get(`${httpUrl}/preferencesPopulated/${clientId}`);
  }
  constructor() {}
}
