import { Injectable } from '@angular/core';
import { AuthResponseData } from './auth.component';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../shared/user.model';
import { HttpClient } from '@angular/common/http';
import { Media } from '../list-page/media.model';
import { Router } from '@angular/router';

const SIGN_UP_URL =
`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=`;
const SIGN_IN_URL =
`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=`;

const AUTH_API_KEY = 'AIzaSyB3dC7CPHd-IrfIM7ijbMxIvLEpM-PMCiE';


export interface UserData {
  user: User,
  list: Media[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private hasAccountSource = new BehaviorSubject<boolean>(false);
  currentHasAccount = this.hasAccountSource.asObservable();

  signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL + AUTH_API_KEY, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const { email, localId, idToken, expiresIn } = res;
        this.handleAuth(email, localId, idToken, +expiresIn, firstName, lastName)
      })
    )
  }

  login(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<AuthResponseData>(SIGN_IN_URL + AUTH_API_KEY, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const { email, localId, idToken, expiresIn } = res;
        this.handleAuth(email, localId, idToken, +expiresIn, firstName, lastName)
      })
    )
  }

  fetchUser(authResponse: AuthResponseData) {
    this.http.get<UserData>(this.firebaseURL + authResponse.localId + '.json').subscribe(res => {
      const { email, firstName, lastName } = res.user;
      const user = new User(email, authResponse.idToken, new Date(authResponse.expiresIn), authResponse.localId, firstName, lastName);
      this.currentUser.next(user);
      localStorage.setItem("userData", JSON.stringify(user));
    })
  }



  changeHasAccount(hasAccount: boolean) {
    this.hasAccountSource.next(hasAccount);
  }
}

