import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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
      <input matInput [type]="hide ? 'password' : 'text'" />
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
})
export class PasswordComponent {
  hide = true;
}
