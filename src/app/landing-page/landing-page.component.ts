import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {

  constructor(private authService: AuthService, private router: Router) { }
  
  onLoginClick() {
    this.authService.changeHasAccount(true);
    this.router.navigate(['/auth']);
  }
}
