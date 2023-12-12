import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit, OnDestroy {
  userId: string;
  userSub: Subscription;

  constructor (private authService: AuthService, private http: HttpClient) {}
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit() {
     this.userSub = this.authService.currentUser.subscribe((res) => {
      this.userId = res.firstName;
    });
  }
}
