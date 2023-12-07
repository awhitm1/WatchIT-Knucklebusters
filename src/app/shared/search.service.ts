import { Injectable } from '@angular/core';
import { TitleDetailsResponseData } from './list.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Media } from '../list-page/media.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults: TitleDetailsResponseData[] = [];
  searchResultsObs = new Subject<TitleDetailsResponseData[]>();
  url = `https://api.themoviedb.org/3/search/multi?query=`;
  searchDetails = new Subject<Media>();
  media: Media;


  constructor(private http: HttpClient) { }

  searchMedia(searchTerm: string) {
    const authToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYTQyNGJlNWNiNGNjMTNmM2JlNzU3MWFkZWQ4NjA3ZiIsInN1YiI6IjY1Njk0Yjc2NjM1MzZhMDBlMTIwMTM1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-xsK5e95GPN9u1prRaUKxtymlpm2SxwRm9xMxCyEiqo';

    const headerDict = {
      'accept': 'application/json',
      'Authorization': authToken
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }
    return this.http.get<any>(this.url + searchTerm + '&include_adult=false' + '&language=en-US', requestOptions).subscribe(res => {
      console.log(res);
      this.searchResults = res.results;
      this.searchResultsObs.next(this.searchResults.slice());
    } )
  }

  getSearchResults(){
    return this.searchResults.slice();
  }

  fetchFromMovieTonight(id: number, mediaType: string) {
    const movieTonightBaseURL = 'https://streaming-availability.p.rapidapi.com/get?output_language=en&tmdb_id=';

    const headerDict = {
      'X-RapidAPI-Key': '8719718adfmsh9353da1b46c546bp15d82bjsn414bc0a1edf0',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }

    return this.http.get<Media>(movieTonightBaseURL + mediaType + "/" + id, requestOptions).subscribe(res => {
      this.media = res;
      console.log(this.media);
      this.searchDetails.next(this.media);
    })
  }
}
