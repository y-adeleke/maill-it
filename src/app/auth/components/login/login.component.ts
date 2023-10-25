import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../shared/custom-input/customInput';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordComponent } from '../shared/password/password.component';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    PasswordComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  formControl = new FormControl();
  // passwordValidators = [Validators.required, Validators.minLength(8)];

  constructor() {
    this.formControl.setValidators([Validators.email, Validators.required]);
  }
}
