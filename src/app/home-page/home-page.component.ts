import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ListService, TitleDetailsResponseData } from '../shared/list.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit, OnDestroy {
  userId: string;
  userSub: Subscription;
  popSub: Subscription;
  popularList: TitleDetailsResponseData[];
  popularListFull: TitleDetailsResponseData[];

  constructor (private authService: AuthService, private listService: ListService) {}

  unsub(){
    alert("You have unsubscribed!");
  }

  ngOnInit() {
     this.userSub = this.authService.currentUser.subscribe((res) => {
      this.userId = res.firstName;
    });

    this.listService.getPopular();
    this.popSub = this.listService.popListObs.subscribe(pop => {
      this.popularListFull = pop;
      this.popularList = pop.slice(0,3);
    });

    }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
