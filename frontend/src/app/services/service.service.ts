import { Injectable, inject } from '@angular/core';
import { ServiceModel } from '../Models/service.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  http: HttpClient = inject(HttpClient);
  private testSub = new Subject<ServiceModel[]>();
  private url: string = 'http://localhost:3001';
  ses$ = this.testSub.asObservable();
  // private servicesSubject = new BehaviorSubject<ServiceModel[]>(null);
  // services$ = this.servicesSubject.asObservable();
  addServices(formData: FormData) {
    return this.http.post(this.url + '/service', formData);
  }

  getAllServices() {
    return this.http.get(this.url + '/allServices').pipe(
      tap((response: ServiceModel[]) => {
        this.testSub.next(response);
      })
    );
  }

  getAllServicesTypes() {
    return this.http.get(this.url + '/allServiceType');
  }

  updateServices(formData: FormData, id: string) {
    return this.http.patch(this.url + '/updateService/' + id, formData);
  }

  deleteService(id: string) {
    return this.http.delete(this.url + '/deleteService/' + id);
  }

  searchService(query: { q: string; filterBy: string }) {
    return this.http.post(this.url + '/search/services', { query: query });
  }
}
