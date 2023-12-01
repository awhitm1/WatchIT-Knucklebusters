import { Injectable, OnInit } from '@angular/core';
import { Media } from '../list-page/media.model';
import { StreamInfo } from '../list-page/streamInfo.model';
import { Subject } from 'rxjs';
import { Price } from '../list-page/price.model';

@Injectable({
  providedIn: 'root'
})
export class ListService implements OnInit {
  listObs = new Subject<Media[]>;

  myList: Media[] = [
    new Media ('The Batman', 2022, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/dfa50804-e6f6-4fa2-a732-693dbc50527b', 'uhd'), 'tt1877830', 414906, 'movie', 'watching' ),
    new Media ('The Dark Knight Rises', 2012, new StreamInfo ('netflix', 'subscription', 'https://www.netflix.com/title/70213514/'), 'tt1345836', 49026, 'movie', 'watching' ),
    new Media ('Batman Forever', 1995, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/506c2994-fa03-452b-9131-e25d68fac01f', 'uhd'), 'tt1877830', 414, 'movie', 'want' ),
    new Media ('Batman Returns', 1992, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/7ebb10fa-4552-405c-a5d2-3cc5b21193c7', 'uhd'), 'tt0103776', 364, 'movie', 'want' ),
    new Media ('Batman', 1966, new StreamInfo ('hbo', 'subscription', 'https://play.max.com/movie/5e0da7f2-7422-4e58-8023-60bbd37adf33', null, new Price(3.99, 'usd')), 'tt0060153', 2661, 'movie', 'watched')
  ];


  constructor() { }

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
}
