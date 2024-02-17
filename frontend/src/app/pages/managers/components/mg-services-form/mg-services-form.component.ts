import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../../services/service.service';
import { error } from 'console';

@Component({
  selector: 'mg-services-form',
  templateUrl: './mg-services-form.component.html',
  styleUrl: './mg-services-form.component.scss',
})
export class MgServicesFormComponent {
  serviceServices: ServiceService = inject(ServiceService);
  formData: FormData = new FormData();
  file: File;
  @Output() onCloseFormClicked: EventEmitter<null> = new EventEmitter<null>();
  @Output() loadingState: EventEmitter<boolean> = new EventEmitter<boolean>();

  mgForm: FormGroup;

  setLoadingToTrue() {
    this.loadingState.emit(true);
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
  }
  closeForm() {
    this.onCloseFormClicked.emit();
  }

  onFileDropped(file: File) {
    // let formData = new FormData();
    console.log(file);
    this.file = file;
  }

  triggerFileInput(input: HTMLInputElement, event: Event) {
    event.preventDefault();
    input.click();
  }

  mgFormSubmit() {
    this.formData.append('image', this.file);
    console.log(this.formData.getAll('image'));

    Object.keys(this.mgForm.value).forEach((key) => {
      const control = this.mgForm.get(key);
      if (key !== 'image' && control) {
        this.formData.append(key, control.value);
      }
    });

    this.serviceServices.addServices(this.formData).subscribe({
      next: (response) => {
        this.serviceServices.getAllServices();
        this.setLoadingToTrue();
        this.closeForm();
      },
      error: (error) => {
        console.error(error);
        this.formData = new FormData();
      },
      complete: () => {
        this.formData = new FormData();
      },
    });
  }
}
