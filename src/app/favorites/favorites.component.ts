import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { ReducedGif } from '../models/giphyresponse';
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
  
  favoriteGifs$ = this.dataservice.getFavoriteGifs$();

  private readonly destroy$ = new Subject<void>();

  constructor(private dataservice: DataService, public loaderService: LoaderService, private layoutUpdateService: LayoutUpdateService) { }

  ngOnInit(): void {
    this.layoutUpdateService.getLayoutUpdateTrigger$()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(async () => {
      let tries = 10;
      for (let index = 0; index < tries; index++) {
        await new Promise(resolve => setTimeout(resolve, 100)).then(() => this.fixLayout());
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeFavorite(reducedGif: ReducedGif): void {
    this.dataservice.removeFavoriteGif$(reducedGif);
    this.layoutUpdateService.setLayoutUpdate$(true);
  }

  // ngx-masonry seems to have trouble with undefined heights (overlapping)
  fixLayout() {
    if (this.masonry !== undefined) {
      // this.masonry.reloadItems();
      this.masonry.layout();
    }
  }
}
