import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { first } from 'rxjs';

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
export class RegistrationFormComponent implements OnInit {
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();
  userInfoFormGroup: FormGroup = new FormGroup('');

  countries = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private readonly stepper: CdkStepper
  ) {}

  ngOnInit(): void {
    this.userInfoFormGroup = this.formBuilder.group({
      firstName: ['', [Validators.required, noWhiteSpaceValidator()]],
      lastName: ['adeleke', [Validators.required, noWhiteSpaceValidator()]],
      dob: ['', [Validators.required]],
      countryCode: ['+1', Validators.required],
      phoneNumber: ['4', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.formGroupEmitter.emit(this.userInfoFormGroup);
  }

  //User information (Step 1)
  userInformationHandler() {
    if (this.userInfoFormGroup.valid) {
      const data = {
        firstName: this.userInfoFormGroup.value.firstName,
        lastName: this.userInfoFormGroup.value.lastName,
        dob: this.userInfoFormGroup.value.dob,
        phone:
          this.userInfoFormGroup.value.countryCode +
          this.userInfoFormGroup.value.phoneNumber,
      };
      this.stepper.next();
    } else {
      alert('Please fill all fields');
    }
  }
}
