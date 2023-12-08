import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/list-page/media.model';
import { ListService, TitleDetailsResponseData } from 'src/app/shared/list.service';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent {

  resultDetails: Media;

  constructor(
      public dialogRef: MatDialogRef<SearchDetailsComponent>,
      private listService: ListService,
      @Inject(MAT_DIALOG_DATA) public data: TitleDetailsResponseData) { }

  onCancel() {
    this.dialogRef.close();
  }

  addMedia(id: number) {
    // const media: Media = new Media();
    // this.listService.addMedia(media);
    this.dialogRef.close();
  }

}
