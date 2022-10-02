import { Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';
import { LayoutUpdateService } from '../services/layout-update.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  @ViewChild('favorites') masonry?: NgxMasonryComponent;
  @ViewChildren('favoritesListItems') favoritesListItems?: QueryList<ElementRef>;
  
  favoriteItems$ = this.dataService.getFavoriteItems$();
  favoriteItemCount = 0;
  
  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService, public loaderService: LoaderService, private layoutUpdateService: LayoutUpdateService) { }

  ngOnInit(): void {
    this.dataService.getFavoriteItems$()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((favoriteItems) => this.favoriteItemCount = favoriteItems.length)
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
    this.fixLayout();
  }

  playVideo(index: number): void {
    if(this.favoritesListItems !== undefined) {
      let hoveredItem = this.favoritesListItems.toArray()[index];

      hoveredItem.nativeElement.muted = false;
      hoveredItem.nativeElement.play();
    }
  }
  
  stopVideo(index: number): void {
    if(this.favoritesListItems !== undefined) {
      let hoveredItem = this.favoritesListItems.toArray()[index];
      
      hoveredItem.nativeElement.muted = true;
      hoveredItem.nativeElement.pause();
    }
  }

  // ngx-masonry seems to have trouble with undefined heights (overlapping)
  async fixLayout() {
    if (this.masonry !== undefined) {
      let tries = this.layoutUpdateService.tries;
      let pauseTime = this.layoutUpdateService.pauseTime;

      for (let index = 0; index < tries; index++) {
        await new Promise(resolve => setTimeout(resolve, pauseTime)).then(() => this.masonry!.layout());
      }
    }
  }
}
