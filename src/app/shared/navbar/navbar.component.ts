import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public authService: AuthService,private router: Router) { }
  onLoginClick() {
    this.authService.changeHasAccount(true);
    this.router.navigate(['/auth']);
  }
}
