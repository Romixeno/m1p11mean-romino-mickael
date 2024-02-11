import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  TemplateRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  elRef: ElementRef = inject(ElementRef);
  renderer: Renderer2 = inject(Renderer2);
  @HostListener('window:scroll', ['$event']) onWindowScroll() {
    const offset = window.scrollY;

    if (offset > 8) {
      this.renderer.removeClass(this.elRef.nativeElement, 'blur');
    } else {
      this.renderer.addClass(this.elRef.nativeElement, 'blur');
    }
  }
}
