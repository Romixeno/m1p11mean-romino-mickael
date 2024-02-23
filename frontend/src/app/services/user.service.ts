import { Injectable, inject } from '@angular/core';
import { User } from '../Models/user.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

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
  constructor() {}
}
