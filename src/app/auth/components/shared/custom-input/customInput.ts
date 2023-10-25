import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <mat-form-field class="example-full-width">
      <input
        [type]="type"
        matInput
        [formControl]="formControl"
        [placeholder]="placeholder"
      />
    </mat-form-field>
  `,
  styles: [
    `
      .example-full-width {
        width: 100%;
      }
    `,
  ],
})
export class CustomInputComponent {
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() formControl: FormControl = new FormControl();
}
