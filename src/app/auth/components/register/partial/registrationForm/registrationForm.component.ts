import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CdkStepper } from '@angular/cdk/stepper';
import { RouterLink } from '@angular/router';
import { noWhiteSpaceValidator } from '../Validations';
import { RecaptchaVerifier } from 'firebase/auth';
import { AuthSignUpService } from 'src/app/auth/auth-signup-service.service';
import { Auth } from '@angular/fire/auth';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registrationForm.component.html',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterLink,
  ],
})
export class RegistrationFormComponent implements OnInit, AfterViewInit {
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();
  userInfoFormGroup: FormGroup;
  recaptchaVerifier: RecaptchaVerifier;

  countries = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private readonly stepper: CdkStepper,
    private authService: AuthSignUpService,
    private auth: Auth,
    private loadingMessageService: LoadingMessageService
  ) {}

  ngOnInit(): void {
    this.userInfoFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required, noWhiteSpaceValidator()]],
      lastName: ['', [Validators.required, noWhiteSpaceValidator()]],
      dob: ['', [Validators.required]],
      countryCode: ['+1', Validators.required],
      phoneNumber: ['', [Validators.required, noWhiteSpaceValidator()]],
    });
    this.formGroupEmitter.emit(this.userInfoFormGroup);
  }

  ngAfterViewInit(): void {
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'sign-in-btn', {
      size: 'invisible',
    });
  }

  //User information (Step 1)
  async userInformationHandler() {
    if (this.userInfoFormGroup.valid) {
      const data = {
        firstName: this.userInfoFormGroup.value.firstName,
        lastName: this.userInfoFormGroup.value.lastName,
        dob: this.userInfoFormGroup.value.dob,
        phone:
          this.userInfoFormGroup.value.countryCode +
          this.userInfoFormGroup.value.phoneNumber,
        username: '',
        uid: '',
        recoveryEmail: '',
      };
      this.loadingMessageService.showLoading();
      const res = await this.authService.sendVerificationCode(
        data,
        this.recaptchaVerifier
      );
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.stepper.next();
      }
      this.loadingMessageService.openSnackBarMessage(res.message);
    }
  }
}
