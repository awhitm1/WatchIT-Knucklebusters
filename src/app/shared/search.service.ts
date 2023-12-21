import { Injectable } from '@angular/core';
import { TitleDetailsResponseData } from './list.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Media } from '../list-page/media.model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults: TitleDetailsResponseData[] = [];
  searchResultsObs = new Subject<TitleDetailsResponseData[]>();
  url = `https://api.themoviedb.org/3/search/multi?query=`;
  searchDetails = new Subject<Media>();
  media: Media;
  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(null);


  constructor(private http: HttpClient) {
   }

  searchMedia(searchTerm: string) {
    if (searchTerm === null) {
      return;
    }
    this.searchTerm.next(searchTerm);

    const authToken = environment.authToken;

    const headerDict = {
      'accept': 'application/json',
      'Authorization': authToken
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }
    return this.http.get<any>(this.url + searchTerm + '&include_adult=false' + '&language=en-US', requestOptions).subscribe(res => {
      this.searchResults = res.results;
      this.searchTerm.next(searchTerm);
      this.searchResultsObs.next(this.searchResults.slice());
    } )
  }

  getSearchResults(){
    return this.searchResults.slice();
  }

  fetchFromMovieTonight(id: number, mediaType: string) {
    const movieTonightBaseURL = 'https://streaming-availability.p.rapidapi.com/get?output_language=en&country=us&tmdb_id=';

    const headerDict = {
      'X-RapidAPI-Key': environment.rapidAPItoken,
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }

    return this.http.get<Media>(movieTonightBaseURL + mediaType + "/" + id, requestOptions).subscribe(res => {
      this.media = res;
      this.searchDetails.next(this.media);
    })
  }
}
