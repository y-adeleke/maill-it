import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { noWhiteSpaceValidator } from '../register/partial/Validations';
import { AuthAccessService } from '../../auth-access-service.service';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-password',
  standalone: true,
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
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  hide = true;
  oobCode: string | null;
  passwordForm: FormGroup;

  @ViewChild('stepper') stepper: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authAcessService: AuthAccessService,
    private loadingMessageService: LoadingMessageService,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group({
      password: [
        '',
        [Validators.required, Validators.minLength(8), noWhiteSpaceValidator()],
      ],
    });
  }

  ngOnInit(): void {
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
  }

  onPasswordInput() {
    let password = this.passwordForm.get('password')?.value?.replace(/\s/g, '');
    this.passwordForm.get('password')?.setValue(password, { emitEvent: false });
  }

  async passwordFormHandler() {
    if (this.passwordForm.valid) {
      const newPassword = this.passwordForm.get('password')?.value.trim();
      this.loadingMessageService.showLoading();
      const res = await this.authAcessService.newPassword(
        this.oobCode,
        newPassword
      );
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.stepper.next();
      }
      this.loadingMessageService.openSnackBarMessage(res.message);
    }
  }

  async resetToLogin() {
    this.router.navigateByUrl('/login');
  }
}
