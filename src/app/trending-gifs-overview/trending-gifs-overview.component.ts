import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LayoutUpdateService } from '../services/layout-update.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-trending-gifs-overview',
  templateUrl: './trending-gifs-overview.component.html',
  styleUrls: ['./trending-gifs-overview.component.scss'],
  providers: [GiphyService]
})
export class TrendingGifsOverviewComponent implements OnInit, OnDestroy {
  @ViewChild('trending') masonry?: NgxMasonryComponent;

  @HostListener('window:scroll')
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      // Prevent multiple loads
      if(this.loaderService.isLoading.getValue() === false) {
        this.giphyService.getNextItems("trending", environment.gTrendingGifsUrl);
      }
    }
  }

  trendingResults$ = this.dataservice.getTrendingResults$();
  
  private readonly destroy$ = new Subject<void>();

  constructor(private giphyService: GiphyService, private dataservice: DataService, private loaderService: LoaderService, private layoutUpdateService: LayoutUpdateService) { }

  ngOnInit(): void {
    this.layoutUpdateService.getLayoutUpdateTrigger$()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(async () => {
      let tries = this.layoutUpdateService.tries;
      let pauseTime = this.layoutUpdateService.pauseTime;

      for (let index = 0; index < tries; index++) {
        await new Promise(resolve => setTimeout(resolve, pauseTime)).then(() => this.fixLayout());
      }
    });

    this.giphyService.getTrendingGifs()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.dataservice.setTrendingResults$(reducedTrendingResults);
      this.layoutUpdateService.setLayoutUpdate$(true);
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(item: ReducedData): void {
    this.dataservice.addFavoriteItem$(item);
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
