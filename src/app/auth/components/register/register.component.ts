import { Component, OnInit } from '@angular/core';
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
  ],
})
export class RegisterComponent implements OnInit {
  userInfoFormGroup: FormGroup = new FormGroup('');
  secondFormGroup = this.formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  isEditable = true;

  countries = [
    { code: '+1', name: 'USA' },
    { code: '+44', name: 'UK' },
    // ... add other countries here
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.userInfoFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required],
      countryCode: ['+1', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }
}
