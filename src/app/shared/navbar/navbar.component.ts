import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  searchTerm: string;
  userId: string;
  userSub: Subscription;
 
  constructor(public authService: AuthService,private router: Router,private searchService: SearchService) { }
  onLoginClick() {
    this.authService.changeHasAccount(true);
    this.router.navigate(['/auth']);
  }
   onSignupClick(){
    this.authService.changeHasAccount(false);
    this.router.navigate(['/auth']);

   }
    onSearchClick() {
    this.searchService.searchMedia(this.searchTerm);
    this.router.navigate(['/search-results']);
 }
 ngOnInit() {
  this.userSub = this.authService.currentUser.subscribe((res) => {

   if (!!res){
     this.userId = res.firstName;
   }
 });
}
}
