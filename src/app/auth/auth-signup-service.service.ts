import { Injectable } from '@angular/core';
import { Auth, RecaptchaVerifier } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  setDoc,
  doc,
  CollectionReference,
  DocumentData,
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
} from './auth-shared/helpers';
import { BehaviorSubject } from 'rxjs';
import { checkFieldExists } from './auth-shared/helpers';
import { generateEmailSuggestions } from './auth-shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthSignUpService {
  private usersCollection: CollectionReference<DocumentData>;
  private confirmationResult: ConfirmationResult;
  private userData: UserDetails;
  private regSuccess: boolean = false;
  private availableEmails = new BehaviorSubject<string[]>([]);

  constructor(private auth: Auth, private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
  }

  getEmailSuggestions() {
    return this.availableEmails.asObservable();
  }

  async sendVerificationCode(
    userDetails: UserDetails,
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<AuthResponse> {
    this.regSuccess = false;
    if (
      await checkFieldExists(this.usersCollection, 'phone', userDetails.phone)
    ) {
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
      return { success: false, message: error.message };
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
      const suggestion = generateEmailSuggestions(
        this.usersCollection,
        this.userData.firstName,
        this.userData.lastName
      );
      this.availableEmails.next(await suggestion);
      return { success: true, message: 'Phone number verified' };
    } catch {
      return { success: false, message: 'Invalid code' };
    }
  }

  async createUser(
    username: string,
    recoveryEmail: string,
    password: string
  ): Promise<AuthResponse> {
    if (!this.regSuccess)
      return { success: false, message: 'You are not verified' };
    if (!this.userData)
      return { success: false, message: 'No user data available' };

    const usernameEmail = convertUsernameToEmail(username);
    try {
      //check username is unique
      if (
        await checkFieldExists(this.usersCollection, 'username', usernameEmail)
      ) {
        return { success: false, message: 'Username already in use' };
      }
      // use the recovery email to create a firebase account
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        recoveryEmail,
        password
      );
      const uid = userCredential.user.uid;
      this.userData.uid = uid;
      this.userData.username = usernameEmail;
      this.userData.recoveryEmail = recoveryEmail;
      const docRef = await setDoc(
        doc(this.usersCollection, uid),
        this.userData
      );
      console.log('Firebase UID:', uid);
      return {
        success: true,
        message: 'User successfully created',
        data: docRef,
      };
    } catch (error: any) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'Recovery email already in use';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid recovery email';
      } else if (error.code === 'auth/weak-password') {
        message = 'Weak password';
      }
      return {
        success: false,
        message,
      };
    }
  }
}
