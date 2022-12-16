import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData } from '../models/giphyresponse';
import { DataTransformerService } from '../services/data-transformer.service';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LoaderService } from '../services/loader.service';

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

  constructor(private giphyService: GiphyService, private dataService: DataService, private loaderService: LoaderService, private dataTransformerService: DataTransformerService) { }

  ngOnInit(): void {
    this.giphyService.getTrendingGifs()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.totalCount = reducedTrendingResults.pagination.total_count;
      this.dataService.setTrendingResults$(reducedTrendingResults);
    })

    combineLatest([
      this.dataService.getTrendingResults$(),
      this.dataService.getFavoriteItems$()
    ])
    .pipe(
      map((result) => this.dataTransformerService.updateFavoriteStatusInitial(result[0], result[1])),
      // tap(() => {console.log("Trending combinelatest")}),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(item: ReducedData): void {
    this.dataService.addFavoriteItem$(item);
  }

  selectItem(selectedItem: ReducedData): void {
    this.dataService.setSelectedItem$(selectedItem);
  }

  loadNextBatch() {
    if(this.loaderService.isLoading.getValue() === false) {
      this.giphyService.getNextItems("trending", environment.gTrendingGifsUrl);
    }
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
