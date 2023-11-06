import { Injectable } from '@angular/core';
import { Auth, RecaptchaVerifier } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  query,
  addDoc,
  where,
  getDocs,
  CollectionReference,
} from '@angular/fire/firestore';
import {
  signInWithPhoneNumber,
  ConfirmationResult,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  UserDetails,
  convertUsernameToEmail,
  AuthResponse,
} from './components/shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: CollectionReference<UserDetails> | any;
  private confirmationResult: ConfirmationResult | undefined;
  private userData: UserDetails | undefined;
  private regSuccess: boolean = false;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  private async checkPhoneNumberExists(phone: string): Promise<boolean> {
    const queryData = query(this.usersCollection, where('phone', '==', phone));
    const querySnapshot = await getDocs(queryData);
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
      console.log(userDetails);
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
      this.userData.username = email;
      console.log(userCredential);
      const docRef = await addDoc(this.usersCollection, this.userData);
      console.log('docref', docRef);
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

  async signIn(username: string, password: string): Promise<AuthResponse> {
    return {
      success: true,
      message: 'User successfully signed in',
      data: {},
    };
  }

  async signOut(): Promise<AuthResponse> {
    try {
      await this.auth.signOut();
      return {
        success: true,
        message: 'User successfully signed out',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Error signing out',
      };
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    return {
      success: true,
      message: 'Password reset email sent',
    };
  }
}
