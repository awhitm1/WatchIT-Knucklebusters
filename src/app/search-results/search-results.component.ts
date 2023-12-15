import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from '../list-page/media.model';
import { ListService, TitleDetailsResponseData } from '../shared/list.service';
import { MatDialog } from '@angular/material/dialog';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { SearchService } from '../shared/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnDestroy{

  searchResults: TitleDetailsResponseData[] = [];
  searchResult: TitleDetailsResponseData;
  searchDetailsSub: Subscription;
  searchResultsSub = this.searchService.searchResultsObs.subscribe(obs => {
    this.searchResults = obs;
    console.log('this.searchResults', this.searchResults);

  });
  searchTerm: string;

  tmdb_img_baseURL = 'https://image.tmdb.org/t/p/original';

  constructor(public dialog: MatDialog, private searchService: SearchService) {
  }

  ngOnInit(): void {

    this.searchService.searchTerm.subscribe(search => {
      this.searchTerm = search;
    });
    this.searchService.searchMedia(this.searchTerm);
    this.searchDetailsSub = this.searchService.searchDetails.subscribe({
      next: (details: Media) => {
          this.openModal(details);
      }
    })
  }

  openModal(details) {
    if (details.result.streamingInfo.us === undefined) {
      alert('No streaming info available for this title');
      return;
    }
    this.searchResult = this.searchResults.find(result => result.id === details.result.tmdbId);

    const detailsInfo: Media = {
      title: details.result.title,
      year: details.result.year,
      service: details.result.streamingInfo.us,
      imdbId: details.result.imdbId,
      tmdbId: details.result.tmdbId,
      type: details.result.type,
    }
    const dialogRef = this.dialog.open(SearchDetailsComponent, {
      data: {
        detailsInfo,
        searchResults: this.searchResult
      }
    });
  }

  fetchFromMovieTonight(id: number, mediaType: string) {
    this.searchService.fetchFromMovieTonight(id, mediaType);
  }

  ngOnDestroy(): void {
    this.searchResultsSub.unsubscribe();
    this.searchDetailsSub.unsubscribe();
  }
}
