import { Component, OnDestroy, OnInit } from '@angular/core';
import { Media } from './media.model';

import { ListService, TitleDetailsResponseData } from '../shared/list.service';
import { Subscription } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { ItemDetailsComponent } from './item-details/item-details.component';


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

  constructor(private listsvc: ListService, public dialog: Dialog){}

  ngOnInit(): void {
    this.myMedia = this.listsvc.getMyList();

    this.listSub = this.listsvc.listObs.subscribe(obs => {
      this.myMedia = obs;
    });

    this.detailsSub = this.listsvc.detailsObs.subscribe(obs => {
      this.titleDetails = obs;
      console.log("titleDetails: ", this.titleDetails);
      this.openDialog();
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

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(ItemDetailsComponent, {
      data: this.titleDetails,
    });

    dialogRef.closed.subscribe(result => {
      console.log('The dialog was closed');

    });
  }
}
