import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceModelWithSelected } from '../../../../Models/service.model';

@Component({
  selector: 'app-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrl: './confirm-appointment.component.scss',
})
export class ConfirmAppointmentComponent {
  @Output() closeFormBtnClicked: EventEmitter<null> = new EventEmitter<null>();
  @Input() selectedServices: ServiceModelWithSelected[];
  @Input() selectedEmployees: { [key: string]: string };
  @Input() dateTime: Date;
  cart: any[] = [];
  getTotalPrice(): number {
    return this.selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
  }
  getDurationTotal(): number {
    return this.selectedServices.reduce(
      (total, service) => total + service.duration,
      0
    );
  }

  closeForm() {
    this.closeFormBtnClicked.emit();
  }
}
