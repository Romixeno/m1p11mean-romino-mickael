import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../validators/passwordValidator';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrl: './password-form.component.scss',
})
export class PasswordFormComponent {
  @Output() onBtnCloseForm: EventEmitter<null> = new EventEmitter<null>();
  user;
  authService: AuthService = inject(AuthService);
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

  closeForm(event: Event) {
    event.preventDefault();
    this.onBtnCloseForm.emit();
  }

  onSubmit() {
    if (this.user.userType == 'Client') {
    } else {
    }
  }
}
