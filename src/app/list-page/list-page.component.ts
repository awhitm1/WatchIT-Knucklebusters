import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from './media.model';
import { StreamInfo } from './streamInfo.model';
import { ListService, TitleDetailsResponseData } from '../shared/list.service';
import { Subscription } from 'rxjs';
import { TitleDetails } from './titleDetails.model';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit, OnDestroy{
  listSub: Subscription;
  detailsSub: Subscription;
  myMedia: Media[];
  titleDetails: TitleDetailsResponseData;

  constructor(private listsvc: ListService){}

  ngOnInit(): void {
    this.myMedia = this.listsvc.getMyList();

    this.listSub = this.listsvc.listObs.subscribe(obs => {
      this.myMedia = obs;
    });

    this.detailsSub = this.listsvc.detailsObs.subscribe(obs => {
      this.titleDetails = obs;
      console.log("titleDetails: ", this.titleDetails)
    })

    console.log("myMedia: ", this.myMedia)

  }

  ngOnDestroy(): void {
    this.listSub.unsubscribe();
    this.detailsSub.unsubscribe();
  }

  delMedia(id: string){
    this.listsvc.delMedia(id)
  }

  getInfo(id: number){
    this.listsvc.getDetails(id);

  }
}
