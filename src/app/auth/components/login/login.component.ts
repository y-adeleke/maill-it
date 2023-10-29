import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomInputComponent } from '../shared/custom-input/customInput';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordComponent } from '../shared/password/password.component';
import { MatIconModule } from '@angular/material/icon';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
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
    MatIconModule,
  ],
})
export class LoginComponent implements OnInit {
  hide = true;
  signInForm: FormGroup = new FormGroup({});
  // passwordValidators = [Validators.required, Validators.minLength(8)];

  constructor(private formbuilder: FormBuilder) {}
  ngOnInit(): void {
    this.signInForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  signInHandler() {
    console.log(this.signInForm.value);
  }
}
