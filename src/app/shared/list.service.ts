import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Media } from '../list-page/media.model';
import { StreamInfo } from '../list-page/streamInfo.model';
import { BehaviorSubject, Subject, Subscription, take} from 'rxjs';
import { Price } from '../list-page/price.model';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService, UserData } from '../auth/auth.service';
import { User } from './user.model';



export interface TitleDetailsResponseData {
  backdrop_path: string,
  genres: [{
      name: string}],
  homepage: string,
  id: number,
  overview: string,
  poster_path: string,
  release_date: string,
  runtime: number,
  tagline: string,
  title: string,
  vote_average: number,
  watchURL?: string,
  name?: string,
  media_type?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ListService {
  firebaseURL = 'https://watchit-45ab3-default-rtdb.firebaseio.com/';

  // listObs = new BehaviorSubject<Media[]>([]);
  // detailsObs = new BehaviorSubject<TitleDetailsResponseData | null>(null);
  listObs = new Subject<Media[]>;
  detailsObs = new Subject<TitleDetailsResponseData>;
  selectedDetails: TitleDetailsResponseData = {backdrop_path: '', genres: [{name:''}], homepage: '', id: null, overview: '', poster_path: '', release_date: '', runtime: null, tagline: '', title: '', vote_average: null};
  popList: TitleDetailsResponseData[];
  popListObs = new Subject<TitleDetailsResponseData[]>;
  currentUserSub: Subscription;
  loggedInUser: User;
  loggedInUserData: UserData;
  myList: Media[];

  constructor(private http: HttpClient, public auth: AuthService) {
    this.initUserData();
   }

  initUserData(){
    // Setup subscription to currentUser
    this.currentUserSub = this.auth.currentUser.subscribe((user) => {
      this.loggedInUser = user;
      // Get currentUser's data from Firebase
      this.fetchFromFirebase(this.loggedInUser);
    });
  }

  fetchFromFirebase(user: User){
    this.http.get<UserData>(this.firebaseURL+user.id+".json",{}).subscribe((res: UserData) => {
      this.loggedInUserData = res;
      this.myList = res.list;
      if (this.myList){
        this.listObs.next(this.myList.slice());
      }
    })
  }

  addMedia(media: Media){
    console.log(media);
    console.log("myList: ", this.myList)

    // check if media status is set
    if (!!media.status && this.myList){
      this.myList.push(media);
      this.listObs.next(this.myList.slice());
    } else if (this.myList){
      media.status = 'Want to Watch!';
      this.myList.push(media);
      this.listObs.next(this.myList.slice());
    } else {
      media.status = 'Want to Watch!';
      this.myList = [media];
      this.listObs.next(this.myList.slice())
    }

    this.updateList(this.myList);
  }

  getListIndexByTmdbId(tmdbId: number){
    const itemIndex = this.myList.findIndex(items => items.tmdbId === tmdbId);
    return itemIndex;
  }

  delMedia(tmdbId: number){
    this.myList.splice(this.getListIndexByTmdbId(tmdbId),1);
    this.updateList(this.myList);
    this.listObs.next(this.myList.slice());
    // ** Need to Save myList to Firebase **
  }

  getMyList(){
    if (this.myList){
      return this.myList.slice();
    }
  }

  getDetails(tmdbId: number){
    // Building the TMDB API call
    const tmdbRootUrl = 'https://api.themoviedb.org/3/movie/';
    const authToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYTQyNGJlNWNiNGNjMTNmM2JlNzU3MWFkZWQ4NjA3ZiIsInN1YiI6IjY1Njk0Yjc2NjM1MzZhMDBlMTIwMTM1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-xsK5e95GPN9u1prRaUKxtymlpm2SxwRm9xMxCyEiqo';

    const headerDict = {
      'accept': 'application/json',
      'Authorization': authToken
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }

    // API Call to get the TMDB data that includes image paths
    return this.http.get<TitleDetailsResponseData>(tmdbRootUrl + tmdbId + '?language=en-US', requestOptions).subscribe(res => {
      this.selectedDetails.backdrop_path = res.backdrop_path;
      this.selectedDetails.genres = res.genres;
      this.selectedDetails.homepage = res.homepage;
      this.selectedDetails.id = res.id;
      this.selectedDetails.overview = res.overview;
      this.selectedDetails.release_date = res.release_date;
      this.selectedDetails.runtime = res.runtime;
      this.selectedDetails.poster_path = res.poster_path;
      this.selectedDetails.tagline = res.tagline;
      this.selectedDetails.title = res.title;
      this.selectedDetails.vote_average = res.vote_average;

      // Next out the details of the selected item - notifies that there IS a selected item
      this.detailsObs.next(this.selectedDetails)
    });
  }

  // For when the list is modified (edit/update an item)
  updateList(newList: Media[]){
    // Code to send to firebase
    this.loggedInUserData.list = newList;
    this.http.put<UserData>(this.firebaseURL + this.loggedInUser.id + '.json', this.loggedInUserData).subscribe();
  }

  // Get List of Popular Media from TMDB
  getPopular(){
    const tmdbRootUrl = 'https://api.themoviedb.org/3/movie/';
    const authToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYTQyNGJlNWNiNGNjMTNmM2JlNzU3MWFkZWQ4NjA3ZiIsInN1YiI6IjY1Njk0Yjc2NjM1MzZhMDBlMTIwMTM1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-xsK5e95GPN9u1prRaUKxtymlpm2SxwRm9xMxCyEiqo';

    const headerDict = {
      'accept': 'application/json',
      'Authorization': authToken
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }

    return this.http.get<any>(tmdbRootUrl + 'popular?language=en-US', requestOptions).subscribe(res => {
      this.popList = res.results;
      this.popListObs.next(this.popList)
    });
  }

  // fetchFromMovieTonight(id: number) {
  //   const movieTonightBaseURL = 'https://streaming-availability.p.rapidapi.com/get?output_language=en&tmdb_id=';

  //   const headerDict = {
  //     'X-RapidAPI-Key': '8719718adfmsh9353da1b46c546bp15d82bjsn414bc0a1edf0',
	// 	  'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
  //   }

  //   const requestOptions = {
  //     headers: new HttpHeaders(headerDict),
  //   }

  //   return this.http.get<Media>(movieTonightBaseURL + "movie/" + id, requestOptions).subscribe(res => {
  //     console.log(res)
  //   })
  // }
}
