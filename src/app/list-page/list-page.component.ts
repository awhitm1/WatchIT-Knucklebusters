import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Media } from './media.model';

import { ListService, TitleDetailsResponseData } from '../shared/list.service';
import { Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsComponent } from './item-details/item-details.component';
import {MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { AuthService } from '../auth/auth.service';
import { User } from '../shared/user.model';



@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit, OnDestroy, AfterViewInit{
  statusFilter: string;
  filterObs = new Subject<Media[]>;
  listSub: Subscription;
  detailsSub: Subscription;
  myMedia: Media[];
  titleDetails: TitleDetailsResponseData;
  displayedColumns: string[] = ['index','title', 'year', 'status', 'type', 'service', 'Actions', 'cost'];
  displayedColumnsPop: string[] = ['index', 'image', 'title', 'year']
  dataSource: MatTableDataSource<Media>;
  dataSourcePop: MatTableDataSource<TitleDetailsResponseData>;
  popularList: TitleDetailsResponseData[];
  popularListSub: Subscription;
  loggedInUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private listsvc: ListService, public dialog: MatDialog, public auth: AuthService){}

  ngOnInit(): void {
    this.loggedInUser = this.auth.currentUser.value;
    console.log("from list svc: ", this.loggedInUser);
    this.myMedia = this.listsvc.getMyList();
    this.statusFilter = 'All';
    // For Mat Table
    this.listSub = this.listsvc.listObs.subscribe((media: Media[]) => {
      this.myMedia = media;
      this.dataSource = new MatTableDataSource(this.myMedia);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.dataSource = new MatTableDataSource(this.myMedia);

    this.detailsSub = this.listsvc.detailsObs.subscribe(obs => {
      this.titleDetails = obs;
      this.openDialog();
    })

    this.popularListSub = this.listsvc.popListObs.subscribe(pop => {
      this.popularList = pop;
      this.dataSourcePop = new MatTableDataSource(this.popularList);
      this.dataSourcePop.paginator = this.paginator;
      this.dataSourcePop.sort = this.sort;

    })

    console.log("myMedia: ", this.myMedia)

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnDestroy(): void {
    this.listSub.unsubscribe();
    this.detailsSub.unsubscribe();
    this.popularListSub.unsubscribe();
  }
  //Part of Mat Table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  delMedia(id: number){
    this.listsvc.delMedia(id)
  }

  getInfo(id: number){
    this.listsvc.getDetails(id);

  }

  // Modal trigger
  openDialog(): void {
    const id = this.titleDetails.id;
    const idx = this.myMedia.findIndex(medias => medias.tmdbId === id);
    this.titleDetails.watchURL = this.myMedia[idx].service.linkUrl;
    const dialogRef = this.dialog.open(ItemDetailsComponent, {
      maxWidth: 800,
      data: this.titleDetails
    });

  }

  onChangeFilter(){
    if (this.statusFilter === 'All'){
      this.dataSource = new MatTableDataSource(this.myMedia);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else{
      const filtered = this.myMedia.filter((media) => media.status === this.statusFilter);
      this.dataSource = new MatTableDataSource(filtered);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }

  onChangeStatus(){
    this.listsvc.updateList(this.myMedia.slice());
    console.log(this.myMedia)
  }

  // getPops(){
  //   this.listsvc.getPopular()
  // }

  // fetchStreamInfo(id: number){
  //   this.listsvc.fetchFromMovieTonight(id)
  // }
}
