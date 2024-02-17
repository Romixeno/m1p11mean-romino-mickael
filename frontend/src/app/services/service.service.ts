import { Injectable, inject } from '@angular/core';
import { ServiceModel } from '../Models/service.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  http: HttpClient = inject(HttpClient);
  private testSub = new Subject<ServiceModel[]>();
  ses$ = this.testSub.asObservable();
  private servicesSubject = new BehaviorSubject<ServiceModel[]>(null);
  services$ = this.servicesSubject.asObservable();
  addServices(formData: FormData) {
    return this.http.post('http://localhost:3001/service', formData);
  }

  getAllServices() {
    this.http.get('http://localhost:3001/allServices').subscribe({
      next: (response: ServiceModel[]) => {
        this.testSub.next(response);
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
