import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit{

  signupForm: FormGroup;
  loginForm: FormGroup;
  errMsg: string = null;

  hasAccount: boolean = true;

  authObsrv: Observable<AuthResponseData>;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentHasAccount.subscribe({
      next: (hasAccount) => {
        // this.hasAccount = hasAccount;
      }
    })

    // this.authService.currentUser.subscribe((user) => {
    //   console.log(user);
    // })
  }

  onSwitchAuthMode() {
    this.hasAccount = !this.hasAccount;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) return;
    const {firstName, lastName, email, password} = form.value;

    if(this.hasAccount) {
      this.authObsrv = this.authService.login(email, password, firstName, lastName);
    } else {
      this.authObsrv = this.authService.signUp(email, password, firstName, lastName);
    }

    this.authObsrv.subscribe({
      next: (res) => {
        this.router.navigate(['/home-page']);
      },
      error: (err) => {
        this.errMsg = err;
      }
    })

    form.reset();
  }
}
