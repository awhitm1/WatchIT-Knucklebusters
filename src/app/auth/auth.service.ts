import { Injectable } from '@angular/core';
import { AuthResponseData } from './auth.component';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../shared/user.model';
import { HttpClient } from '@angular/common/http';
import { Media } from '../list-page/media.model';

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

  firebaseURL = 'https://watchit-45ab3-default-rtdb.firebaseio.com/';

  signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL + AUTH_API_KEY, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const { email, localId, idToken, expiresIn } = res;
        this.initializeFB(firstName, lastName, email, localId, idToken, +expiresIn);
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

  handleAuth(email: string, userId: string, token: string, expiresIn: number, firstName: string, lastName: string) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    const formUser = new User(email, token, expDate, userId, firstName, lastName);
    this.currentUser.next(formUser);
    localStorage.setItem("userData", JSON.stringify(formUser));
  }

  changeHasAccount(hasAccount: boolean) {
    this.hasAccountSource.next(hasAccount);
  }

  initializeFB(firstName: string, lastName: string, email: string, localId: string, idToken: string, expiresIn: number) {
    let currentUserData: UserData = {
      user: new User(email, idToken, new Date(new Date().getTime() + +expiresIn * 1000), localId, firstName, lastName),
      list: []
    }
    this.http.put(this.firebaseURL + currentUserData.user.id + '.json', currentUserData).subscribe();
  }
}
