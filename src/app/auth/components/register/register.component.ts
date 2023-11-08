import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegistrationFormComponent } from './partial/registrationForm/registrationForm.component';
import { OTPFormComponent } from './partial/otpForm/otpForm.component';
import { EmailPasswordFormComponent } from './partial/email-passwordForm/email-passwordForm.component';
import { Router, RouterLink } from '@angular/router';
import { AuthAccessService } from '../../auth-access-service.service';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';

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

  userInformationFG: FormGroup;
  otpForm: FormGroup;
  emailPasswordForm: FormGroup;

  @ViewChild('stepper') stepper: any;

  constructor(
    private authAccessService: AuthAccessService,
    private loadingMessageService: LoadingMessageService,
    private router: Router
  ) {}

  goBack() {
    this.stepper.previous();
  }
  async onLogin() {
    const email = this.emailPasswordForm.get('email')?.value.trim();
    const password = this.emailPasswordForm.get('password')?.value.trim();
    if (email && password) {
      this.loadingMessageService.showLoading();
      const res = await this.authAccessService.signIn(email, password);
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.router.navigateByUrl('/mail');
      }
    }
  }
}
