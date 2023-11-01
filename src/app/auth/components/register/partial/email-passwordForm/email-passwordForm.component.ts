import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
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
import { OtpInputDirective } from '../../../shared/otp-input.directive';
import { MatChipsModule } from '@angular/material/chips';
import { CdkStepper } from '@angular/cdk/stepper';
import { noWhiteSpaceValidator } from '../Validations';
import { AuthService } from 'src/app/auth/auth-service.service';

@Component({
  selector: 'app-email-password-form',
  templateUrl: './email-passwordForm.component.html',
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
    MatChipsModule,
    OtpInputDirective,
  ],
})
export class EmailPasswordFormComponent implements OnInit {
  hide = true;
  regForm: FormGroup = new FormGroup('');
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  @ViewChild('suggestionsContainer') suggestionsContainer: ElementRef | any;

  constructor(
    private formBuilder: FormBuilder,
    private readonly stepper: CdkStepper,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.regForm = this.formBuilder.group({
      email: ['', [Validators.required, noWhiteSpaceValidator()]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), noWhiteSpaceValidator()],
      ],
    });
    this.formGroupEmitter.emit(this.regForm);
  }

  onChipSelect(event: any) {
    if (event.value) {
      const val = event.value + '@maily.com';
      const email = val.replace(/\s/g, '').toLowerCase();
      this.regForm.get('email')?.setValue(email.trim(), { emitEvent: false });
    }
  }

  onEmailInput() {
    let email = this.regForm.get('email')?.value?.trim();
    if (email === '@maily.com' || email === '') {
      this.regForm.get('email')?.setValue('', { emitEvent: false });
    } else if (!email.includes('@maily.com')) {
      email += '@maily.com';
      email = email.replace(/\s/g, '').toLowerCase();
      this.regForm.get('email')?.setValue(email, { emitEvent: false });
    }
  }

  onPasswordInput() {
    let password = this.regForm.get('password')?.value?.replace(/\s/g, '');
    this.regForm.get('password')?.setValue(password, { emitEvent: false });
  }

  scrollSuggestionHandler() {
    const suggestionEl = this.suggestionsContainer._elementRef.nativeElement;
    suggestionEl.scrollBy({
      left: 100,
      behavior: 'smooth',
    });
  }

  //Email (Step 3)
  emailFormHandler() {
    if (this.regForm.valid) {
      const email = this.regForm.get('email')?.value.trim();
      const password = this.regForm.get('password')?.value.trim();
      console.log({ email, password });
      this.authService.createUser(email, password);
      this.stepper.next();
    }
  }
}
