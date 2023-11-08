import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
import { AuthAccessService } from '../../auth-access-service.service';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';

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
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;

  @ViewChild('stepper') stepper: any;

  constructor(
    private formBuilder: FormBuilder,
    private authAcessService: AuthAccessService,
    private loadingMessageService: LoadingMessageService
  ) {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async emailHandler() {
    if (this.emailForm.valid) {
      this.loadingMessageService.showLoading();
      const res = await this.authAcessService.resetPassword(
        this.emailForm.value.email
      );
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.stepper.next();
      }
      this.loadingMessageService.openSnackBarMessage(res.message);
    }
  }
}
