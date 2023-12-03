import { Injectable, OnInit } from '@angular/core';
import { Media } from '../list-page/media.model';
import { StreamInfo } from '../list-page/streamInfo.model';
import { Subject } from 'rxjs';
import { Price } from '../list-page/price.model';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { TitleDetails } from '../list-page/titleDetails.model';


export interface TitleDetailsResponseData {
  adult: boolean,
  backdrop_path: string,
  belongs_to_collection: {
    id: number,
    name: string,
    poster_path: string,
    backdrop_path: string},
  budget: number,
  genre: [{
    id: number,
    name: string}],
  homepage: string,
  id: number,
  imdb_id: string,
  original_language: string,
  original_tital: string,
  overview: string,
  popularity: number,
  poster_path: string,
  production_companies: [{
    id: number,
    logo_path: string,
    name: string,
    origin_country: string}],
  production_countries: [{
    iso_3166_1: string,
    name: string}],
  release_date: string,
  revenue: number,
  runtime: number,
  spoken_languages: [{
    english_name: string,
    iso_639_1: string,
    name: string}],
  status: string,
  tagline: string,
  title: string,
  video: boolean,
  vote_average: number,
  vote_count: number
}

@Injectable({
  providedIn: 'root'
})
export class ListService implements OnInit {
  listObs = new Subject<Media[]>;
  detailsObs = new Subject<TitleDetailsResponseData>;
  selectedDetails: TitleDetailsResponseData;

  myList: Media[] = [
    new Media ('The Batman', 2022, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/dfa50804-e6f6-4fa2-a732-693dbc50527b', 'uhd'), 'tt1877830', 414906, 'movie', 'watching' ),
    new Media ('The Dark Knight Rises', 2012, new StreamInfo ('netflix', 'subscription', 'https://www.netflix.com/title/70213514/'), 'tt1345836', 49026, 'movie', 'watching' ),
    new Media ('Batman Forever', 1995, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/506c2994-fa03-452b-9131-e25d68fac01f', 'uhd'), 'tt1877830', 414, 'movie', 'want' ),
    new Media ('Batman Returns', 1992, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/7ebb10fa-4552-405c-a5d2-3cc5b21193c7', 'uhd'), 'tt0103776', 364, 'movie', 'want' ),
    new Media ('Batman', 1966, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/5e0da7f2-7422-4e58-8023-60bbd37adf33', null, new Price(3.99, 'usd')), 'tt0060153', 2661, 'movie', 'watched')
  ];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    console.log("service init: ", this.myList)
      this.listObs.next(this.myList.slice());
  }

  addMedia(media: Media){
    this.myList.push(media);
    this.listObs.next(this.myList.slice());
  }

  getListIndexByImdbId(imdbId: string){
    const itemIndex = this.myList.findIndex(items => items.imdbId === imdbId);
    return itemIndex;
  }

  delMedia(imdbId: string){
    this.myList.splice(this.getListIndexByImdbId(imdbId),1);
    this.listObs.next(this.myList.slice());
  }

  getMyList(){
    return this.myList.slice();
  }

  getDetails(tmdbId: number){
    const tmdbRootUrl = 'https://api.themoviedb.org/3/movie/';
    const authToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYTQyNGJlNWNiNGNjMTNmM2JlNzU3MWFkZWQ4NjA3ZiIsInN1YiI6IjY1Njk0Yjc2NjM1MzZhMDBlMTIwMTM1NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-xsK5e95GPN9u1prRaUKxtymlpm2SxwRm9xMxCyEiqo';

    const headerDict = {
      'accept': 'application/json',
      'Authorization': authToken
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    }

    return this.http.get<TitleDetailsResponseData>(tmdbRootUrl + tmdbId + '?language=en-US', requestOptions).subscribe(res => {
      this.selectedDetails = res;
      console.log('fetched Details: ', this.selectedDetails);
      this.detailsObs.next(this.selectedDetails)
    } )
  }
}
