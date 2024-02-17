import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';

@Directive({
  selector: '[appDrag]',
})
export class DragDirective {
  constructor() {}

  @Output() fileDropped: EventEmitter<File> = new EventEmitter<File>();
  @HostBinding('class.active') active = false;

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();

    this.active = true;
  }
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    this.active = false;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      this.fileDropped.emit(event.dataTransfer.files[0]);
    }
  }
}
