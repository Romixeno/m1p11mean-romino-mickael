import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'http://localhost:3001';
  constructor() {}

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
}
