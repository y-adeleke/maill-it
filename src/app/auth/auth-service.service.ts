import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { convertUsernameToEmail } from './components/shared/helpers';
import { UserDetails } from './components/shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  confirmationResult: ConfirmationResult | undefined;
  userData: UserDetails | undefined;
  constructor(private auth: Auth, private firestore: Firestore) {}

  async sendVerificationCode(
    userDetails: UserDetails,
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<{ success: boolean; message: string }> {
    //Confirm from firestore if the phone number is already registered
    try {
      const confirmationResult = await signInWithPhoneNumber(
        this.auth,
        userDetails.phone,
        recaptchaVerifier
      );
      // Save confirmationResult to use it in the next step.
      this.confirmationResult = confirmationResult;
      this.userData = userDetails;
      return { success: true, message: 'Verification code sent' };
    } catch (error) {
      // Handle error
      //phone number already registered
      //Invalid phone numeber
      console.error('Error sending verification code', error);
      return { success: false, message: 'Error sending verification code' };
    }
  }

  async verifyCode(
    code: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (this.confirmationResult) {
        await this.confirmationResult.confirm(code);
        return { success: true, message: 'Phone number verified' };
      } else {
        return { success: false, message: 'Confirmation result not found' };
      }
    } catch (error) {
      console.error('Invalid code', error);
      return { success: false, message: 'Invalid code' };
    }
  }

  async createUser(username: string, password: string): Promise<boolean> {
    try {
      const email = convertUsernameToEmail(username); // Convert username to email
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      console.log('User created', userCredential);
      console.log('User data', this.userData);
      if (this.userData) {
        this.userData.username = username;
      }
      // Store user data or in a  database record
      // await this.firestore.collection('users').doc(userCredential.user.uid).set({ phoneNumber });
      return true; // User successfully created
    } catch (error) {
      // Handle error
      //error for existing email
      console.error('Error creating user', error);
      return false; // User creation failed
    }
  }
}
