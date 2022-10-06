import { Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  @ViewChild('favorites') masonry?: NgxMasonryComponent;
  
  favoriteItems$ = this.dataService.getFavoriteItems$();
  favoriteItemCount = 0;

  detailData?: ReducedData;
  
  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService, public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.dataService.getFavoriteItems$()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((favoriteItems) => {
      this.fixLayout();
      this.favoriteItemCount = favoriteItems.length;
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFavorites(): void {
    this.dataService.clearFavoriteItems$();
  }

  removeFavorite(item: ReducedData): void {
    this.dataService.removeFavoriteItem$(item);
  }

  selectItem(selectedItem: ReducedData): void {
    this.dataService.setSelectedItem$(selectedItem);
  }

  // ngx-masonry seems to have trouble with undefined heights (overlapping)
  async fixLayout() {
    if (this.masonry !== undefined) {
      let tries = environment.layoutUpdateTries;
      let pauseTime = environment.layoutUpdatePauseTime;
      
      for (let index = 0; index < tries; index++) {
        await new Promise(resolve => setTimeout(resolve, pauseTime)).then(() => this.masonry!.layout());
      }
    }
  }
}
