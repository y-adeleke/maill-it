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
      return { success: false, message: error.message };
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
}

/*
sign <in
get username and password 
find  the firestore document with the username and retrerive the recovery email
sign user in with the recovery email and password and retrevie the firebase uid
get the firestore document with the uid and retrieve the data.

reset password
get username
find the firestore document with the username and retrieve the recovery email
send password reset email to recovery email

 */
