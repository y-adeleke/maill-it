import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOtpInput]',
  standalone: true,
})
export class OtpInputDirective {
  @Input() nextElement: ElementRef | null = null;
  @Input() previousElement: ElementRef | null = null;

  constructor(private el: ElementRef, private ngControl: NgControl) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    if (value.length === 1 && this.nextElement) {
      this.nextElement.nativeElement.focus();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (
      event.key === 'Backspace' &&
      this.previousElement &&
      this.ngControl.value === ''
    ) {
      this.previousElement.nativeElement.focus();
    }
  }
}
