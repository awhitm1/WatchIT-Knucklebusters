import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/list-page/media.model';
import { StreamInfo } from 'src/app/list-page/streamInfo.model';
import { ListService } from 'src/app/shared/list.service';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit{

  streamingInfo: StreamInfo[] = [];
  selectedStreamInfo: StreamInfo;
  mediaData: Media;
  selectedBackdrop: string;
  tmdb_img_baseURL = 'https://image.tmdb.org/t/p/original';

  constructor(
    public dialogRef: MatDialogRef<SearchDetailsComponent>,
    private listService: ListService,
    @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit(): void {
      this.mediaData = this.data.detailsInfo;
      this.streamingInfo = this.data.detailsInfo.service;
      this.listService.listObs.subscribe((res) => {
      });
      this.selectedBackdrop = this.data.searchResults.backdrop_path;
      console.log('this.data', this.data);


  }

  onCancel() {
    this.dialogRef.close();
  }

  addMedia(form: NgForm) {
    this.selectedStreamInfo = form.value.info;
    const newMedia: Media = {
      title: this.mediaData.title,
      year: this.mediaData.year,
      service: form.value.info,
      imdbId: this.mediaData.imdbId,
      tmdbId: this.mediaData.tmdbId,
      type: this.mediaData.type,
      status: form.value.status
    }
    this.listService.addMedia(newMedia);
    this.dialogRef.close();
  }

}
