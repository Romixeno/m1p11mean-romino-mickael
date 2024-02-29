import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, Subscriber } from 'rxjs';
import { httpUrl } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  http: HttpClient = inject(HttpClient);

  private paymentStatus = new BehaviorSubject<string>('pending');
  payment$ = this.paymentStatus.asObservable();
  constructor() {}

  setPaymentStatus(status: string) {
    this.paymentStatus.next(status);
  }

  resetPaymentStatus() {
    this.paymentStatus.next('pending');
  }
  createPayment(data: any) {
    return this.http.post(`${httpUrl}/createPayment`, data);
  }
  createOrder(cart: any) {
    return this.http.post(
      `${httpUrl}/payment/orders`,
      { cart: cart },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  captureOrder(orderId: string) {
    return this.http.post(
      `${httpUrl}/payment/orders/${orderId}/capture`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getAllPayment() {
    return this.http.get(`${httpUrl}/allPayment`);
  }
}
