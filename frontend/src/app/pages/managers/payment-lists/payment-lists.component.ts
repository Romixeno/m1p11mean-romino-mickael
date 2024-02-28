import { Component, inject } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { PaymentModel } from '../../../Models/payment.model';

@Component({
  selector: 'app-payment-lists',
  templateUrl: './payment-lists.component.html',
  styleUrl: './payment-lists.component.scss',
})
export class PaymentListsComponent {
  paymentService: PaymentService = inject(PaymentService);
  paymentList: PaymentModel[] = [];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.paymentService.getAllPayment().subscribe({
      next: (response: PaymentModel[]) => {
        console.log(response);
        this.paymentList = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
