import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ListService, TitleDetailsResponseData } from 'src/app/shared/list.service';


@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  selectedItem: TitleDetailsResponseData = {backdrop_path: '', genres: [{name:''}], homepage: '', id: null, overview: '', poster_path: '', release_date: '', runtime: null, tagline: '', title: '', vote_average: null};

  tmdb_img_baseURL = 'https://image.tmdb.org/t/p/original';

  constructor(public listsvc: ListService, public dialogRef: MatDialogRef<ItemDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: TitleDetailsResponseData){}

  ngOnInit(): void {
    // Brings in data from clicked list item
    console.log("selected data: ", this.data)
      this.selectedItem.backdrop_path = this.data.backdrop_path;
      this.selectedItem.genres = this.data.genres;
      this.selectedItem.homepage = this.data.homepage;
      this.selectedItem.id = this.data.id;
      this.selectedItem.overview = this.data.overview;
      this.selectedItem.poster_path = this.data.poster_path;
      this.selectedItem.release_date = this.data.release_date;
      this.selectedItem.runtime = this.data.runtime;
      this.selectedItem.tagline = this.data.tagline;
      this.selectedItem.title = this.data.title;
      this.selectedItem.vote_average = this.data.vote_average;
      this.selectedItem.watchURL = this.data.watchURL;
  }

  // Close the Dialog
  onClose(): void {
    this.dialogRef.close();
    console.log("Close was clicked!");

  }

  openLink(url: string){
    console.log("opening: ", url);
    window.open(url, "_blank")
  }
}
