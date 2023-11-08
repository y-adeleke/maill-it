import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { AuthAccessService } from '../../auth-access-service.service';
import { LoadingMessageService } from 'src/app/shared/loading-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink,
  ],
})
export class LoginComponent implements OnInit {
  hide = true;
  signInForm: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private authAccessService: AuthAccessService,
    private loadingMessageService: LoadingMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.signInForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async signInHandler() {
    this.signInForm.markAllAsTouched();
    if (this.signInForm.valid) {
      console.log(this.signInForm.value);
      const email = this.signInForm.value.email.trim();
      const password = this.signInForm.value.password.trim();
      this.loadingMessageService.showLoading();
      const res = await this.authAccessService.signIn(email, password);
      this.loadingMessageService.hideLoading();
      if (res.success) {
        this.router.navigateByUrl('/mail');
      }
      this.loadingMessageService.openSnackBarMessage(res.message);
    }
  }
}
