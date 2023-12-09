import { Component, Inject, OnInit } from '@angular/core';
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

  constructor(
    public dialogRef: MatDialogRef<SearchDetailsComponent>,
    private listService: ListService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    console.log('modal init data', this.data.detailsInfo);
    console.log('this.data.title', this.data.detailsInfo.title);
    console.log('this.data.streaminfo', this.data.detailsInfo.service);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addMedia(id: number) {
    // const media: Media = new Media();
    // this.listService.addMedia(media);
    this.dialogRef.close();
  }

}
