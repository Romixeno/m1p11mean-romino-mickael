import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Subject, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:3001';
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
    return this.http.post(`${this.baseUrl}/createPayment`, data);
  }
  createOrder(cart: any) {
    return this.http.post(
      `${this.baseUrl}/payment/orders`,
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
      `${this.baseUrl}/payment/orders/${orderId}/capture`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getAllPayment() {
    return this.http.get(`${this.baseUrl}/allPayment`);
  }
}
