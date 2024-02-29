import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  inject,
  NgZone,
} from '@angular/core';
import { ServiceModelWithSelected } from '../../Models/service.model';
import { PaymentService } from '../../services/payment.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AppointmentModel } from '../../Models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
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
  @Input() dateAppointment: Date;
  paymentService: PaymentService = inject(PaymentService);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  appointmentService: AppointmentService = inject(AppointmentService);
  router: Router = inject(Router);
  ngZone: NgZone = inject(NgZone);
  cart: any[] = [];
  ngOnInit(): void {
    this.generateCart();
    paypal
      .Buttons({
        createOrder: async (data, actions) => {
          return new Promise((resolve, reject) => {
            this.paymentService.createOrder(this.cart).subscribe({
              next: (response: any) => {
                // console.log(response);
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
          return new Promise((resolve, reject) => {
            this.paymentService.captureOrder(data.orderID).subscribe({
              next: (response: any) => {
                // console.log(response);
                resolve(response);
                console.log('payment successful');
                this.newAppointment().subscribe({
                  next: (responseId) => {
                    this.newPayment(responseId, response.id).subscribe({
                      next: (value) => {
                        this.setPaymentStatus('completed');
                        this.ngZone.run(() => {
                          this.router.navigateByUrl('/appointment/lists', {
                            state: {
                              message:
                                'Your Payment is completed and appointment scheduled',
                            },
                          });
                        });
                      },
                      error: (error) => {
                        console.error(error);
                      },
                    });
                  },
                  error: (error) => {
                    console.error(error);
                  },
                });
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

  getTotalPrice(): number {
    return this.selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
  }

  getTotalDuration() {
    return this.selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );
  }

  newAppointment(): Observable<string> {
    let selectedServicesByType = {};

    this.selectedServices.forEach((service) => {
      if (!selectedServicesByType[service.type]) {
        selectedServicesByType[service.type] = [];
      }
      selectedServicesByType[service.type].push(service._id);
    });

    const servicesData = Object.keys(selectedServicesByType).map(
      (serviceType) => ({
        serviceType,
        employeeId: this.selectedEmployees[serviceType],
        serviceIds: selectedServicesByType[serviceType],
      })
    );

    const user = this.authService.getUser();

    return new Observable<string>((observer) => {
      this.userService.verifyClientId(user._id).subscribe({
        next: (response) => {
          const data = this.generateDataForAppointment(
            user._id,
            servicesData,
            this.getTotalPrice(),
            this.getTotalDuration(),
            this.dateAppointment
          );

          this.appointmentService.newAppointment(data).subscribe({
            next: (response: any) => {
              console.log(response);
              observer.next(response._id);
              observer.complete();
            },
            error: (error) => {
              console.error(error);
              observer.error(error);
            },
          });
        },
        error: (error) => {
          console.error(error);
          observer.error(error); // Emit the error
        },
      });
    });
  }

  setPaymentStatus(status: string) {
    this.paymentService.setPaymentStatus(status);
  }
  newPayment(appointmentId: string, transactionId: string): Observable<string> {
    const user = this.authService.getUser();
    const data = {
      client: user._id,
      appointmentId: appointmentId,
      transactionId: transactionId,
      amount: this.getTotalPrice(),
    };
    return new Observable<string>((observer) => {
      this.paymentService.createPayment(data).subscribe({
        next: (response) => {
          console.log(response);
          observer.next('success');
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
          console.error(error);
        },
      });
    });
  }

  generateDataForAppointment = (
    userId,
    services,
    price,
    duration,
    date
  ): AppointmentModel => {
    return {
      clientId: userId,
      services: services,
      totalPrice: price,
      totalDuration: duration,
      dateTime: date,
    };
  };
}
