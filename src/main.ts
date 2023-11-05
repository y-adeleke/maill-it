import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';

import { provideAuth, getAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          apiKey: 'AIzaSyClz_DLhZ_QdVDM7jOOmwybzIqDOy9PHRs',
          authDomain: 'mailit-849ed.firebaseapp.com',
          projectId: 'mailit-849ed',
          storageBucket: 'mailit-849ed.appspot.com',
          messagingSenderId: '194795265919',
          appId: '1:194795265919:web:2b1ef28b8a7488fa8bc44a',
          measurementId: 'G-D75H37REKJ',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideAnimations(),
  ],
});
