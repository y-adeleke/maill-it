import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OtpInputDirective } from '../../../../auth-shared/otp-input.directive';
import { CdkStepper } from '@angular/cdk/stepper';
import { AuthSignUpService } from 'src/app/auth/auth-signup-service.service';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otpForm.component.html',
  styleUrls: ['../sharedStyles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    OtpInputDirective,
  ],
})
export class OTPFormComponent implements OnInit {
  otpArray = Array(6).fill(0);
  otpForm: FormGroup = new FormGroup('');
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef> = new QueryList();

  constructor(
    private formBuilder: FormBuilder,
    private readonly stepper: CdkStepper,
    private authService: AuthSignUpService,
    private loadingMessageService: LoadingMessageService
  ) {}

  ngOnInit(): void {
    let otpValidators = [Validators.required];
    this.otpForm = this.formBuilder.group({
      otp0: ['', otpValidators],
      otp1: ['', otpValidators],
      otp2: ['', otpValidators],
      otp3: ['', otpValidators],
      otp4: ['', otpValidators],
      otp5: ['', otpValidators],
    });
    this.formGroupEmitter.emit(this.otpForm);
  }

  //OTP (Step 2)
  async otpFormHandler() {
    if (this.otpForm.valid) {
      const formValue = Object.values(this.otpForm.value);
      const otp = formValue.join('');
      this.loadingMessageService.showLoading();
      const res = await this.authService.verifyCode(otp);
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.stepper.next();
      }
      this.loadingMessageService.openSnackBarMessage(res.message);
      console.log(res.data);
    }
  }
}
