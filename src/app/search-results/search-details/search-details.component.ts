import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/list-page/media.model';
import { StreamInfo } from 'src/app/list-page/streamInfo.model';
import { ListService, TitleDetailsResponseData } from 'src/app/shared/list.service';


@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit{

  resultDetails: Media;
  streamingInfo: StreamInfo[] = [];
  selectedStreamingType: string;
  mediaData: Media;

  constructor(
    public dialogRef: MatDialogRef<SearchDetailsComponent>,
    private listService: ListService,
    @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit(): void {
      this.mediaData = this.data.detailsInfo;
      this.listService.listObs.subscribe((res) => {
        console.log(res);
        
      });

  }

  onCancel() {
    this.dialogRef.close();
  }

  addMedia(form: NgForm) {
    const newMedia: Media = {
      title: this.mediaData.title,
      year: this.mediaData.year,
      service: this.mediaData.service,
      imdbId: this.mediaData.imdbId,
      tmdbId: this.mediaData.tmdbId,
      type: this.mediaData.type,
      status: form.value.status
    }
    this.listService.addMedia(newMedia);
    this.dialogRef.close();
  }

}
