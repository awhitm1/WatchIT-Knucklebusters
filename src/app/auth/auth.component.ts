import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  signupForm: FormGroup;
  loginForm: FormGroup;

  constructor() { }

  onSubmit(form) {
    console.log(form);
  }

}
