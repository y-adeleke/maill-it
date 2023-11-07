import {
  CollectionReference,
  DocumentData,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

export function convertUsernameToEmail(username: string): string {
  if (username.includes('@maily.com')) {
    // The username is already an email
    return username;
  }

  return username + '@maily.com';
}

export interface UserDetails {
  uid: string;
  firstName: string;
  lastName: string;
  dob: Date;
  phone: string;
  username: string;
  recoveryEmail: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export async function checkFieldExists(
  collection: CollectionReference<DocumentData>,
  field: string,
  value: string
): Promise<boolean> {
  const queryData = query(collection, where(field, '==', value));
  const querySnapshot = await getDocs(queryData);
  return !querySnapshot.empty;
}

export function generateBaseEmails(
  firstName: string,
  lastName: string
): string[] {
  const sanitizedFirstName = firstName.toLowerCase();
  const sanitizedLastName = lastName.toLowerCase();
  return [
    `${sanitizedFirstName[0]}${sanitizedLastName}`,
    `${sanitizedLastName[0]}${sanitizedFirstName}`,
    `${sanitizedFirstName}23`,
    `${sanitizedFirstName}${sanitizedLastName[0]}`,
    `${sanitizedLastName}43`,
  ];
}

export async function generateEmailSuggestions(
  collection: CollectionReference<DocumentData>,
  firstname: string,
  lastname: string
): Promise<string[]> {
  let suggestions: string[] = [];
  const baseEmails = generateBaseEmails(firstname, lastname);
  for (const baseEmail of baseEmails) {
    const fullEmail = `${baseEmail}@maily.com`;
    const exists = await checkFieldExists(collection, 'username', fullEmail);
    if (!exists) {
      suggestions.push(baseEmail);
      if (suggestions.length === 5) {
        break;
      }
    }
  }
  return suggestions;
}

export async function getRecoveryEmailByUsername(
  collection: CollectionReference<DocumentData>,
  username: string
) {
  const queryData = query(collection, where('username', '==', username));
  const querySnapshot = await getDocs(queryData);

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    return userData['recoveryEmail'] as string;
  } else {
    return null;
  }
}
