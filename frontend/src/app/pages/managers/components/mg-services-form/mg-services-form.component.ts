import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../../services/service.service';
import { ServiceModel } from '../../../../Models/service.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'mg-services-form',
  templateUrl: './mg-services-form.component.html',
  styleUrls: ['./mg-services-form.component.scss'],
})
export class MgServicesFormComponent {
  serviceServices: ServiceService = inject(ServiceService);
  formData: FormData = new FormData();
  file: File;
  imgUrl: string | ArrayBuffer;
  errorMessage?: string;
  imageTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
  ];
  @Output() onCloseFormClicked: EventEmitter<null> = new EventEmitter<null>();
  @Output() loadingState: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setSuccessMessage: EventEmitter<string> =
    new EventEmitter<string>();
  @Input() isEditMode: boolean = false;
  @Input() service: ServiceModel;
  mgForm: FormGroup;

  setLoadingToTrue() {
    this.loadingState.emit(true);
  }

  setMessage(message: string) {
    this.setSuccessMessage.emit(message);
  }

  ngOnInit() {
    this.mgForm = new FormGroup({
      image: new FormControl(null),
      type: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      duration: new FormControl(null, Validators.required),
      commission: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });

    if (this.service) {
      this.mgForm.patchValue({
        type: this.service.type,
        name: this.service.name,
        price: this.service.price,
        duration: this.service.duration,
        commission: this.service.commission,
        description: this.service.description,
      });
    }
  }

  closeForm() {
    this.onCloseFormClicked.emit();
    this.mgForm.reset();
  }

  onFileDropped(file: File) {
    console.log(file);
    if (this.imageTypes.includes(file.type)) {
      this.file = file;
      this.imgUrl = URL.createObjectURL(file);
    } else {
      console.log("it's not an image");
    }
  }

  fileChanged(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0];
      this.onFileDropped(selectedFile);
    }
  }

  triggerFileInput(input: HTMLInputElement, event: Event) {
    event.preventDefault();
    input.click();
  }

  appendFormData() {
    if (this.file) {
      this.formData.append('image', this.file);
      console.log(this.formData.getAll('image'));
    }
    Object.keys(this.mgForm.value).forEach((key) => {
      const control = this.mgForm.get(key);
      if (key !== 'image' && control) {
        this.formData.append(key, control.value);
      }
    });
  }
  formSubmitOnSuccess(message: string) {
    this.serviceServices.getAllServices().subscribe(() => {});
    this.setLoadingToTrue();
    this.closeForm();
    this.setMessage(message);
  }
  formSubmitOnError(error: HttpErrorResponse) {
    console.error(error);
    this.errorMessage = error.error;
    setTimeout(() => {
      this.errorMessage = null;
    }, 4000);
    this.formData = new FormData();
  }

  mgFormSubmit() {
    // creating case
    if (!this.isEditMode) {
      this.appendFormData();

      this.serviceServices.addServices(this.formData).subscribe({
        next: () => {
          this.formSubmitOnSuccess('Services added successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.formSubmitOnError(error);
        },
        complete: () => {
          this.formData = new FormData();
        },
      });
    }
    // updating case
    else {
      this.appendFormData();
      const servicesId = this.service._id;
      this.serviceServices.updateServices(this.formData, servicesId).subscribe({
        next: () => {
          this.formSubmitOnSuccess('Services updated successfully');
        },
        error: (error: HttpErrorResponse) => {
          this.formSubmitOnError(error);
        },
        complete: () => {
          this.formData = new FormData();
        },
      });
    }
  }
}
