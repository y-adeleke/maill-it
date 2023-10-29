import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  template: `
    <mat-form-field class="example-full-width">
      <input
        matInput
        [type]="hide ? 'password' : 'text'"
        [value]="value"
        (input)="handleInput($event)"
      />
      <button
        mat-icon-button
        matSuffix
        (click)="hide = !hide"
        [attr.aria-label]="'Hide password'"
        [attr.aria-pressed]="hide"
      >
        <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
    </mat-form-field>
  `,
  styles: [
    `
      .example-full-width {
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordComponent),
      multi: true,
    },
  ],
})
export class PasswordComponent {
  hide = true;
  value: string = '';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  handleInput(event: any) {
    this.value = event.target.value;
    this.onChange(this.value);
  }
}
