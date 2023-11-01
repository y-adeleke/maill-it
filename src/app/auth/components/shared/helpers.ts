export function convertUsernameToEmail(username: string): string {
  if (username.includes('@maily.com')) {
    // The username is already an email
    return username;
  }

  return username + '@maily.com';
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  dob: Date;
  phone: string;
  username: string;
}
