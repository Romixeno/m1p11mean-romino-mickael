import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientModel } from '../../../Models/client.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '../../../validators/passwordValidator';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'client-profile',
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ClientProfileComponent {
  showLoading: boolean = false;
  isEditMode: boolean = false;
  client: ClientModel;
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  profileForm: FormGroup;
  selectedFile: File | null = null;
  successMessage: string;
  errorMessage: string;
  imgUrl: string;
  ngOnInit(): void {
    this.showLoading = true;
    const user = this.authService.getUser();

    this.userService.verifyClientId(user._id).subscribe({
      next: (response: ClientModel) => {
        this.showLoading = false;
        this.client = response;
        this.profileForm = this.resetFormGroup();
      },
      error: (error: HttpErrorResponse) => {
        this.showLoading = false;
        this.errorMessage = 'Something occurred...';
      },
    });
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgUrl = e.target.result as string;
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      this.imgUrl = null; // Reset imgUrl if no file selected
    }
  }

  resetFormGroup(): FormGroup {
    return new FormGroup({
      firstName: new FormControl(this.client.firstName, Validators.required),
      lastName: new FormControl(this.client.lastName, Validators.required),
      email: new FormControl(this.client.email, [
        Validators.required,
        CustomValidator.emailFormat,
      ]),
      phoneNumber: new FormControl(
        this.client.phoneNumber,
        Validators.required
      ),
      // password: new FormControl(null, Validators.required),
      // confirmPassword: new FormControl(null),
    });
  }
  setSuccessMessage(message: string) {
    (this.successMessage = message),
      setTimeout(() => {
        this.successMessage = null;
      }, 4000);
  }

  UpdateInfo(event: Event) {
    event.preventDefault();
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.profileForm = this.resetFormGroup();
    }
  }

  onUpdate() {
    const updatedClient = {
      firstName: this.profileForm.get('firstName').value,
      lastName: this.profileForm.get('lastName').value,
      email: this.profileForm.get('email').value,
      phoneNumber: this.profileForm.get('phoneNumber').value,
    };

    if (
      updatedClient.firstName === this.client.firstName &&
      updatedClient.lastName === this.client.lastName &&
      updatedClient.email === this.client.email &&
      updatedClient.phoneNumber === this.client.phoneNumber
    ) {
      // make an update if there is a image
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        this.updateClient(formData);
      }
      return;
    }
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const formValues = this.profileForm.value;
    Object.keys(formValues).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, formValues[key]);
      }
    });

    this.updateClient(formData);
  }

  updateClient(formData: FormData) {
    this.userService.updateClient(this.client._id, formData).subscribe({
      next: (response: ClientModel) => {
        this.client = response;
        const { _id, image, userType, ...other } = this.client;

        this.authService.setUser({
          _id: _id,
          userType: userType,
          image: image,
        });
        this.authService.isAuthenticated();
        this.isEditMode = false;
        this.resetFormGroup();
        this.setSuccessMessage('Your account has been updated successfully');
      },
      error: (error: HttpErrorResponse) => {},
    });
  }
}
