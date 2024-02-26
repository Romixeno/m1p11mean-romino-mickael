import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { EmployeeModel } from '../Models/employee.model';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  http: HttpClient = inject(HttpClient);
  private url: string = 'http://localhost:3001';
  private EmployeeSubject = new Subject<EmployeeModel[]>();
  Employee$ = this.EmployeeSubject.asObservable();
  constructor() {}

  getAllEmployee() {
    // /allEmployer
    return this.http.get(`${this.url}/allEmployer`).pipe(
      tap((response: EmployeeModel[]) => {
        this.EmployeeSubject.next(response);
      })
    );
  }
  addEmployee(formData: FormData) {
    return this.http.post(`${this.url}/addEmployee`, formData);
  }
  updateEmployee(formData: FormData, id: string) {
    // /updateEmployee/:id
    return this.http.patch(`${this.url}/employee/update/${id}`, formData);
  }
  deleteEmployee(id: string) {
    // /deleteEmployee/:_id
    return this.http.delete(`${this.url}/deleteEmployee/${id}`);
  }

  getEmployeeById(id: string) {
    return this.http.get(`${this.url}/oneEmployee/${id}`);
  }

  updatePassword(body: any, id: string) {
    return this.http.patch(`${this.url}/employee/update/password/${id}`, body);
  }
}
