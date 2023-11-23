import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
} from '@angular/fire/firestore';
import { AuthResponse } from './auth-shared/helpers';
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  confirmPasswordReset,
} from 'firebase/auth';
import { getRecoveryEmailByUsername } from './auth-shared/helpers';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthAccessService {
  private usersCollection: CollectionReference<DocumentData>;
  user$: Observable<any>;
  constructor(private auth: Auth, private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, 'users');
    this.user$ = authState(this.auth);
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user));
  }

  async signIn(username: string, password: string): Promise<AuthResponse> {
    try {
      // You need to get the recovery email associated with the username.
      const recoveryEmail = await getRecoveryEmailByUsername(
        this.usersCollection,
        username
      );
      if (!recoveryEmail) {
        return {
          success: false,
          message: 'No user found with that username',
        };
      }
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        recoveryEmail,
        password
      );
      console.log(userCredential.user.uid);
      return {
        success: true,
        message: 'Welcome back!',
      };
    } catch (error: any) {
      let message = error.message;
      if (error.code === 'auth/invalid-login-credentials') {
        message = 'Incorrect credentials';
      } else if (error.code === 'auth/user-not-found') {
      } else if (error.code === 'auth/too-many-requests') {
        message =
          'Too many requests. Please reset your password / try again later.';
      }
      return { success: false, message };
    }
  }

  async signOut(): Promise<AuthResponse> {
    try {
      await signOut(this.auth);
      return { success: true, message: 'Successfully signed out' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async resetPassword(username: string): Promise<AuthResponse> {
    try {
      const recoveryEmail = await getRecoveryEmailByUsername(
        this.usersCollection,
        username
      );
      if (!recoveryEmail) {
        return { success: false, message: 'No user found with that username' };
      }
      await sendPasswordResetEmail(this.auth, recoveryEmail);
      return { success: true, message: 'Password reset email sent' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }

  async newPassword(oobCode: string, password: string): Promise<AuthResponse> {
    try {
      await confirmPasswordReset(this.auth, oobCode, password);
      return { success: true, message: 'Password reset successful' };
    } catch (error: any) {
      let message = error.message;
      if (error.code === 'auth/invalid-action-code') {
        message = 'The reset code is invalid or expired.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is weak';
      } else if (error.code === 'auth/internal-error') {
        message = 'You are not authorized to perform this action.';
      }
      return { success: false, message: message };
    }
  }
}
