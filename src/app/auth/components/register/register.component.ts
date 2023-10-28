import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ViewChild,
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
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { OtpInputDirective } from '../shared/otp-input.directive';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    OtpInputDirective,
    MatChipsModule,
  ],
})
export class RegisterComponent implements OnInit {
  timer: any;
  reRenderBtn = false;
  isEditable = true;
  otpArray = Array(6).fill(0);

  userInfoFormGroup: FormGroup = new FormGroup('');
  otpForm: FormGroup = new FormGroup('');
  emailForm: FormGroup = new FormGroup('');

  countries = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
  ];
  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef> = new QueryList();
  @ViewChild('suggestionsContainer') suggestionsContainer: ElementRef | any;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.triggerSlideRightButton();
    this.userInfoFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['adeleke', [Validators.required]],
      dob: ['', Validators.required],
      countryCode: ['+1', Validators.required],
      phoneNumber: ['4', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });

    let otpValidators = [Validators.required, Validators.pattern('^[0-9]*$')];
    this.otpForm = this.formBuilder.group({
      otp0: ['', otpValidators],
      otp1: ['', otpValidators],
      otp2: ['', otpValidators],
      otp3: ['', otpValidators],
      otp4: ['', otpValidators],
      otp5: ['', otpValidators],
    });

    this.emailForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  triggerSlideRightButton() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.reRenderBtn = false;
    this.timer = setTimeout(() => {
      this.reRenderBtn = true;
    }, 100);
  }

  scrollSuggestionHandler() {
    const suggestionEl = this.suggestionsContainer._elementRef.nativeElement;
    suggestionEl.scrollBy({
      left: 100,
      behavior: 'smooth',
    });
  }

  //User information (Step 1)
  userInformationHandler() {
    if (this.userInfoFormGroup.valid) {
      console.log(this.userInfoFormGroup.value);
      this.triggerSlideRightButton();
    }
  }

  //OTP (Step 2)
  otpFormHandler() {
    if (this.otpForm.valid) {
      const { otp0, otp1, otp2, otp3, otp4, otp5 } = this.otpForm.value;
      const userInputedOtp = otp0 + otp1 + otp2 + otp3 + otp4 + otp5;
      this.triggerSlideRightButton();
    }
  }

  //Email (Step 3)
  emailFormHandler() {
    if (this.emailForm.valid) {
      console.log(this.emailForm.value);
      this.triggerSlideRightButton();
    }
  }
}
