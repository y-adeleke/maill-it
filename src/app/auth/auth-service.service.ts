import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { convertUsernameToEmail } from './components/shared/helpers';
import { UserDetails } from './components/shared/helpers';
import { AuthResponse } from './components/shared/helpers';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<UserDetails>;
  private confirmationResult: ConfirmationResult | undefined;
  private userData: UserDetails | undefined;
  private regSuccess: boolean = false;

  constructor(private auth: Auth, private afs: AngularFirestore) {
    this.usersCollection = this.afs.collection<UserDetails>('users');
  }
  private async checkPhoneNumberExists(phone: string): Promise<boolean> {
    const querySnapshot = await this.usersCollection.ref
      .where('phone', '==', phone)
      .limit(1)
      .get();
    return !querySnapshot.empty;
  }

  async sendVerificationCode(
    userDetails: UserDetails,
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<AuthResponse> {
    this.regSuccess = false;

    if (await this.checkPhoneNumberExists(userDetails.phone)) {
      return { success: false, message: 'Phone number has already been used' };
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(
        this.auth,
        userDetails.phone,
        recaptchaVerifier
      );
      this.confirmationResult = confirmationResult;
      this.userData = userDetails;
      this.regSuccess = true;
      return { success: true, message: 'Verification code sent' };
    } catch (error: any) {
      let errorMessage = 'Error sending verification code';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests, please try again later';
      }
      return { success: false, message: errorMessage };
    }
  }

  async verifyCode(code: string): Promise<AuthResponse> {
    this.regSuccess = false;
    if (!this.confirmationResult) {
      return {
        success: false,
        message: 'No confirmation result to verify code',
      };
    }

    try {
      await this.confirmationResult.confirm(code);
      this.regSuccess = true;
      return { success: true, message: 'Phone number verified' };
    } catch {
      return { success: false, message: 'Invalid code' };
    }
  }

  async createUser(username: string, password: string): Promise<AuthResponse> {
    if (!this.regSuccess)
      return { success: false, message: 'You are not verified' };
    if (!this.userData)
      return { success: false, message: 'No user data available' };

    const email = convertUsernameToEmail(username);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.userData.username = username;
      const docRef = await this.usersCollection.add(this.userData);
      return {
        success: true,
        message: 'User successfully created',
        data: docRef,
      };
    } catch (error: any) {
      let message = 'Error creating user: ';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message += 'Email already in use';
          break;
        case 'auth/invalid-email':
          message += 'Invalid email';
          break;
        default:
          message += error.message;
          break;
      }
      return {
        success: false,
        message,
      };
    }
  }
}
