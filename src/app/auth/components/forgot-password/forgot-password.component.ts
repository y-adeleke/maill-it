import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationFormComponent } from '../register/partial/registrationForm/registrationForm.component';
import { OTPFormComponent } from '../register/partial/otpForm/otpForm.component';
import { EmailPasswordFormComponent } from '../register/partial/email-passwordForm/email-passwordForm.component';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { noWhiteSpaceValidator } from '../register/partial/Validations';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    RegistrationFormComponent,
    OTPFormComponent,
    EmailPasswordFormComponent,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ForgotPasswordComponent {
  isEditable = false;
  hide = true;

  emailForm: FormGroup = new FormGroup('');
  otpForm: FormGroup | any;
  passwordForm: FormGroup = new FormGroup('');

  @ViewChild('stepper') stepper: any;

  goBack() {
    this.stepper.previous();
  }

  constructor(private formBuilder: FormBuilder) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.passwordForm = this.formBuilder.group({
      password: [
        '',
        [Validators.required, Validators.minLength(8), noWhiteSpaceValidator()],
      ],
    });
  }

  onPasswordInput() {
    let password = this.passwordForm.get('password')?.value?.replace(/\s/g, '');
    this.passwordForm.get('password')?.setValue(password, { emitEvent: false });
  }

  emailHandler() {
    if (this.emailForm.valid) {
      console.log(this.emailForm.value);
      this.stepper.next();
    }
  }
  passwordFormHandler() {
    if (this.passwordForm.valid) {
      console.log(this.passwordForm.value);
      this.stepper.next();
    }
  }
}
