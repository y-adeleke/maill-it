import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy,
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
import { MatChipsModule } from '@angular/material/chips';
import { CdkStepper } from '@angular/cdk/stepper';
import { noWhiteSpaceValidator } from '../Validations';
import { AuthSignUpService } from 'src/app/auth/auth-signup-service.service';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';
import { Subscription } from 'rxjs';
import { emailDomainValidator } from 'src/app/auth/auth-shared/helpers';

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
export class EmailPasswordFormComponent implements OnInit, OnDestroy {
  hide = true;
  regForm: FormGroup = new FormGroup('');
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();
  availableEmails: string[];
  emailSub: Subscription;

  @ViewChild('suggestionsContainer') suggestionsContainer: ElementRef | any;

  constructor(
    private formBuilder: FormBuilder,
    private readonly stepper: CdkStepper,
    private authService: AuthSignUpService,
    private loadingMessageService: LoadingMessageService
  ) {}

  ngOnInit(): void {
    this.regForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          noWhiteSpaceValidator(),
          Validators.email,
          emailDomainValidator('maily.com'),
        ],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8), noWhiteSpaceValidator()],
      ],
      recoveryEmail: ['', [Validators.email]],
    });
    this.formGroupEmitter.emit(this.regForm);
    this.emailSub = this.authService.getEmailSuggestions().subscribe((data) => {
      this.availableEmails = data;
    });
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
    } else if (!email.includes('@maily.com') && email.includes('@')) {
      email += 'maily.com';
      email = email.replace(/\s/g, '').toLowerCase();
      this.regForm.get('email')?.setValue(email, { emitEvent: false });
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
  async emailFormHandler() {
    if (this.regForm.valid) {
      const email = this.regForm.get('email')?.value.trim();
      const password = this.regForm.get('password')?.value.trim();
      const recoveryEmail = this.regForm.get('recoveryEmail')?.value.trim();
      this.loadingMessageService.showLoading();
      const res = await this.authService.createUser(
        email,
        recoveryEmail,
        password
      );
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.stepper.next();
      }
      this.loadingMessageService.openSnackBarMessage(res.message);
      console.log(res.data);
    }
  }

  ngOnDestroy(): void {
    this.emailSub.unsubscribe();
  }
}
