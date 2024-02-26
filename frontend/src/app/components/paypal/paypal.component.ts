import { Component, ViewChild, ElementRef, Input, inject } from '@angular/core';
import { ServiceModelWithSelected } from '../../Models/service.model';
import { PaymentService } from '../../services/payment.service';
declare var paypal;
@Component({
  selector: 'paypal',
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.scss',
})
export class PaypalComponent {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @Input() selectedServices: ServiceModelWithSelected[];
  @Input() selectedEmployees: { [key: string]: string };
  paymentService: PaymentService = inject(PaymentService);
  cart: any[] = [];
  ngOnInit(): void {
    this.generateCart();
    paypal
      .Buttons({
        createOrder: async (data, actions) => {
          return new Promise((resolve, reject) => {
            this.paymentService.createOrder(this.cart).subscribe({
              next: (response: any) => {
                console.log(response);
                if (response.id) {
                  resolve(response.id);
                } else {
                  reject('Order Id not found');
                }
              },
              error: (error) => {
                reject(error);
              },
            });
          });
        },
        onApprove: (data, actions) => {
          console.log(data);
          return new Promise((resolve, reject) => {
            this.paymentService.captureOrder(data.orderID).subscribe({
              next: (response) => {
                console.log(response);
                resolve(response);
                console.log('payment successful');
              },
              error: (error) => {
                console.error('Capture error:', error);
                // Handle capture error
                reject(error);
              },
            });
          });
        },
        onError: (err) => {
          console.error(err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }

  generateCart() {
    this.selectedServices.forEach((service, index) => {
      const data = {
        id: index + 1,
        name: service.name,
        price: service.price,
      };

      this.cart.push(data);
    });
  }
}
