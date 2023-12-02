import { Injectable } from '@angular/core';

const SIGN_UP_URL =
`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=`;
const SIGN_IN_URL =
`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}
