import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export class CustomValidator {
  static passwordMatch(group: FormGroup) {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (
      confirmPasswordControl.value == null ||
      confirmPasswordControl.value == ''
    ) {
      confirmPasswordControl.setErrors({ required: true });
      return { confirmPasswordRequired: true };
    } else if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPasswordControl.setErrors(null);
      return null;
    }
  }

  static emailFormat(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }
}
