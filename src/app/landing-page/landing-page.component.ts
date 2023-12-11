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
  constructor(private authService: AuthService, private router: Router,private searchService: SearchService) { }
  
  onLoginClick() {
    this.authService.changeHasAccount(true);
    this.router.navigate(['/auth']);
  }
  onSearchClick() {
    this.searchService.searchMedia(this.searchTerm);
    this.router.navigate(['/search-results']);
  }
}
