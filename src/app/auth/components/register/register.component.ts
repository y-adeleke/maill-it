import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
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
  showSignInBtn = true;
  isEditable = true;
  otpArray = Array(6).fill(0);

  userInfoFormGroup: FormGroup = new FormGroup('');
  otpForm: FormGroup = new FormGroup('');
  emailForm: FormGroup = new FormGroup('');

  countries = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    // ... add other countries here
  ];
  @ViewChildren('otpInput') otpInputs: QueryList<ElementRef> = new QueryList();
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.userInfoFormGroup = this.formBuilder.group({
      firstName: ['yusuf', [Validators.required]],
      lastName: ['adeleke', [Validators.required]],
      dob: ['', Validators.required],
      countryCode: ['+1', Validators.required],
      phoneNumber: [
        '4',
        [(Validators.required, Validators.pattern('^[0-9]*$'))],
      ],
    });

    this.otpForm = this.formBuilder.group({
      otp0: ['', Validators.required],
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
    });

    this.emailForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  //User information (Step 1)
  userInformationHandler() {
    console.log(this.userInfoFormGroup.value);
    this.showSignInBtn = false;
    console.log(this.showSignInBtn);
  }
}
