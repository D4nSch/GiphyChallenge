import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LayoutUpdateService } from '../services/layout-update.service';
import { LoaderService } from '../services/loader.service';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-trending-gifs-overview',
  templateUrl: './trending-gifs-overview.component.html',
  styleUrls: ['./trending-gifs-overview.component.scss'],
  providers: [GiphyService]
})
export class TrendingGifsOverviewComponent implements OnInit, OnDestroy {
  @ViewChild('trending') masonry?: NgxMasonryComponent;

  trendingResults$ = this.dataService.getTrendingResults$();
  totalCount = 0;
  
  private readonly destroy$ = new Subject<void>();

  constructor(private giphyService: GiphyService, private dataService: DataService, private loaderService: LoaderService, private layoutUpdateService: LayoutUpdateService) { }

  ngOnInit(): void {
    this.giphyService.getTrendingGifs()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.totalCount = reducedTrendingResults.pagination.total_count;
      this.dataService.setTrendingResults$(reducedTrendingResults);
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(item: ReducedData): void {
    this.dataService.addFavoriteItem$(item);
  }

  loadNextBatch() {
    if(this.loaderService.isLoading.getValue() === false) {
      this.giphyService.getNextItems("trending", environment.gTrendingGifsUrl);
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
