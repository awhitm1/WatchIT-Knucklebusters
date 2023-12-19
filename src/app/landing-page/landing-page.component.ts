import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { SearchService } from '../shared/search.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  
  searchTerm: string;
  showSearchAlert = false;
  showListAlert = false;

  constructor(private authService: AuthService, private router: Router,private searchService: SearchService) { }
  
  onSignupClick(){
    this.authService.changeHasAccount(false);
    this.authService.currentUser.subscribe((user) => {
      if (user) {
        this.router.navigate(['/home-page']);
      } else {
        this.router.navigate(['/auth']);
      }
    });
   }  
  //  onSmartSearchClick() {
  //   this.authService.currentUser.subscribe((user) => {  
  //   if (user) {
  //     this.router.navigate(['/search-results']);
  //   } else {
  //     alert('Please login to use search functionality');
  //   }
  //   });
  // }
  onSmartSearchClick() {
    this.authService.currentUser.subscribe((user) => {  
      if (user) {
        this.router.navigate(['/search-results']);
      } else {
        this.showSearchAlert = true;
      }
    });
  }
  // onWatchlistClick() {
  //   this.authService.currentUser.subscribe((user) => {  
  //   if (user) {
  //     this.router.navigate(['/home-page']);
  //   } else {
  //     alert('Please login to watch your list');
  //   }
  //   });
  // }
  onWatchlistClick() {
      this.authService.currentUser.subscribe((user) => {  
      if (user) {
        this.router.navigate(['/home-page']);
      } else {
        this.showListAlert = true;
      }
      });
    }
}
