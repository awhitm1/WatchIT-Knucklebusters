import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  userId: string;

  constructor (private authService: AuthService) {}

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  }

}
