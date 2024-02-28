import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss',
})
export class ConfirmActionComponent {
  @Input() selectedData: { selectedId: string; type: string };
  @Output() closeFormEvent: EventEmitter<string> = new EventEmitter<string>();
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  closeForm(action: string) {
    this.closeFormEvent.emit(action);
  }

  confirmBtnClicked() {
    if (this.selectedData.type == 'service') {
      this.addRemoveServiceFavorite(this.selectedData.selectedId);
    } else {
      this.addRemoveEmployeeFavorite(this.selectedData.selectedId);
    }
  }

  addRemoveServiceFavorite(serviceId: string) {
    const user = this.authService.getUser();
    this.userService.addRemoveServicePreference(user._id, serviceId).subscribe({
      next: (response) => {
        this.closeForm('closeRefetch');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  addRemoveEmployeeFavorite(employeeId: string) {
    const user = this.authService.getUser();
    this.userService
      .addRemoveEmployeePreference(user._id, employeeId)
      .subscribe({
        next: (response) => {
          this.closeForm('closeRefetch');
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
