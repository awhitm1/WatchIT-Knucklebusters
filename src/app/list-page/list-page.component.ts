import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from './media.model';
import { StreamInfo } from './streamInfo.model';
import { ListService } from '../shared/list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit, OnDestroy{
  listSub: Subscription;
  myMedia: Media[];

  constructor(private listsvc: ListService){}

  ngOnInit(): void {
    this.myMedia = this.listsvc.getMyList();

    this.listSub = this.listsvc.listObs.subscribe(obs => {
      this.myMedia = obs;
    });
      console.log("myMedia: ", this.myMedia)
  }

  ngOnDestroy(): void {
    this.listSub.unsubscribe();
  }

  delMedia(id: string){
    this.listsvc.delMedia(id)
  }
}
