import { Injectable } from '@angular/core';
import { AuthResponseData } from './auth.component';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../shared/user.model';
import { HttpClient } from '@angular/common/http';
import { Media } from '../list-page/media.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

export interface UserData {
  user: User,
  list: Media[]
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  // BehaviorSubject to observe if the user has an account
  private hasAccountSource = new BehaviorSubject<boolean>(false);
  currentHasAccount = this.hasAccountSource.asObservable();

  // Method to sign up a user
  signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<AuthResponseData>(environment.SIGN_UP_URL + environment.AUTH_API_KEY, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const { email, localId, idToken, expiresIn } = res;
        this.initializeFB(firstName, lastName, email, localId, idToken, +expiresIn);
      })
    )
  }
  // Method to log in a user
  login(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<AuthResponseData>(environment.SIGN_IN_URL + environment.AUTH_API_KEY, {
      email,
      password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const authResponse = res;
        this.fetchUser(authResponse)
      })
    )
  }
  // Method to fetch user data from Firebase
  fetchUser(authResponse: AuthResponseData) {
    this.http.get<UserData>(environment.firebaseURL + authResponse.localId + '.json').subscribe(res => {
      const { email, firstName, lastName } = res.user;
      const user = new User(email, authResponse.idToken, new Date(authResponse.expiresIn), authResponse.localId, firstName, lastName);
      this.currentUser.next(user);
      localStorage.setItem("userData", JSON.stringify(user));
    })
  }
  // Method to change the value of hasAccountSource
  changeHasAccount(hasAccount: boolean) {
    this.hasAccountSource.next(hasAccount);
  }
  // Method to initialize user data in Firebase
  initializeFB(firstName: string, lastName: string, email: string, localId: string, idToken: string, expiresIn: number) {
    let currentUserData: UserData = {
      user: new User(email, idToken, new Date(new Date().getTime() + +expiresIn * 1000), localId, firstName, lastName),
      list: []
    }
    this.http.put(environment.firebaseURL + currentUserData.user.id + '.json', currentUserData).subscribe();
    this.currentUser.next(currentUserData.user);
  }
  // Method to log out a user
  logout() {
    this.currentUser.next(null);
    localStorage.removeItem("userData");
    this.router.navigate(['/landing-page'])
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
      firstName: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    } else {
      const loadedUser = new User(
        userData.email,
        userData._token,
        new Date(userData._tokenExpirationDate),
        userData.id,
        userData.firstName,
      );
      if (loadedUser.token) {
        if (new Date(userData._tokenExpirationDate) < new Date()) {
          this.currentUser.next(null);
          localStorage.removeItem("userData");
          this.router.navigate(["/landing-page"]);
        } else {
          this.currentUser.next(loadedUser);
          this.router.navigate(["/home-page"]);
        }

      }
    }
  }
}

