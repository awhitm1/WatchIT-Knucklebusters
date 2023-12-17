import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ListService, TitleDetailsResponseData } from '../shared/list.service';
import { Media } from '../list-page/media.model';
import { SearchService } from '../shared/search.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchDetailsComponent } from '../search-results/search-details/search-details.component';

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
  searchDetailsSub: Subscription;
  searchResult: TitleDetailsResponseData;

  constructor (private authService: AuthService, private listService: ListService, private searchService: SearchService, private dialog: MatDialog) {}

 //subject to list service   broadcast   add newMedia

  unSub(){
    alert("You have unsubscribed!");
  }

  addToList(i) {
    let newAdd = this.searchService.fetchFromMovieTonight(
      this.popularList[i].id, 'movie'
    )
    this.searchResult = this.popularList[i];

    // const mediaList: Media[] = this.listService.listObs.getValue();
    // const newMedia = this.popularListFull

    // const newMedia = {
    //   this.listsvc.popularListFull;
    // }

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

    this.searchDetailsSub = this.searchService.searchDetails.subscribe({
      next: (details: Media) => {
        this.openModal(details)
      }
    })

  }

  openModal(details) {
    console.log('opened modal');

    if (details.result.streamingInfo.us === undefined) {
      alert('No streaming info available for this title');
      return;
    }

    const detailsInfo: Media = {
      title: details.result.title,
      year: details.result.year,
      service: details.result.streamingInfo.us,
      imdbId: details.result.imdbId,
      tmdbId: details.result.tmdbId,
      type: 'movie',
    }
    const dialogRef = this.dialog.open(SearchDetailsComponent, {
      data: {
        detailsInfo,
        searchResults: this.searchResult
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.popSub.unsubscribe();
    this.searchDetailsSub.unsubscribe();
  }
}
