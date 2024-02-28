import { AppointmentModel } from './appointment.model';
import { ClientModel } from './client.model';

export class PaymentModel {
  client: ClientModel;
  appointmentId: AppointmentModel;
  transactionId: string;
  amount: number;
  status: string;
  paymentDate: Date;
}
