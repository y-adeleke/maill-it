import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationFormComponent } from './partial/registrationForm/registrationForm.component';
import { OTPFormComponent } from './partial/otpForm/otpForm.component';
import { EmailPasswordFormComponent } from './partial/email-passwordForm/email-passwordForm.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    RegistrationFormComponent,
    OTPFormComponent,
    EmailPasswordFormComponent,
    RouterLink,
  ],
})
export class RegisterComponent {
  isEditable = true;

  userInformationFG: FormGroup | any;
  otpForm: FormGroup | any;
  emailPasswordForm: FormGroup | any;

  @ViewChild('stepper') stepper: any;

  goBack() {
    this.stepper.previous();
  }
}
