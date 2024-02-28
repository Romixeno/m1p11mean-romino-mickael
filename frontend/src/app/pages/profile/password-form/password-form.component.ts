import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../validators/passwordValidator';
import { UserService } from '../../../services/user.service';
import { EmployeesService } from '../../../services/employees.service';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss',
})
export class PasswordFormComponent {
  @Output() onBtnCloseForm: EventEmitter<null> = new EventEmitter<null>();
  user;
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  employeeService: EmployeesService = inject(EmployeesService);
  passwordForm: FormGroup;
  successMessage: string;
  errorMessage: string;
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(null, Validators.required),
      pass: new FormGroup(
        {
          password: new FormControl(null, Validators.required),
          confirmPassword: new FormControl(null, Validators.required),
        },
        { validators: CustomValidator.passwordMatch }
      ),
    });
  }

  setSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = null;
      this.closeForm();
    }, 4000);
  }
  closeForm(event?: Event) {
    event?.preventDefault();
    this.onBtnCloseForm.emit();
  }

  onSubmit() {
    if (this.user.userType == 'Client') {
      const Data = {
        currentPassword: this.passwordForm.get('currentPassword').value,
        password: this.passwordForm.get('pass.password').value,
      };

      this.userService.updatePassword(Data, this.user._id).subscribe({
        next: (value) => {
          this.setSuccessMessage('Password Changed Successfully');
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      const Data = {
        currentPassword: this.passwordForm.get('currentPassword').value,
        password: this.passwordForm.get('pass.password').value,
      };

      this.employeeService.updatePassword(Data, this.user._id).subscribe({
        next: (value) => {
          this.setSuccessMessage('Password Changed Successfully');
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
}
