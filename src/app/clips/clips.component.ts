import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgxMasonryComponent } from 'ngx-masonry';
import { combineLatest, concat, forkJoin, map, of, Subject, switchMap, take, takeLast, takeUntil, tap, withLatestFrom, zip } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData, ReducedGiphyResponse } from '../models/giphyresponse';
import { DataTransformerService } from '../services/data-transformer.service';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-clips',
  templateUrl: './clips.component.html',
  styleUrls: ['./clips.component.scss'],
  providers: [GiphyService]
})
export class ClipsComponent implements OnInit {
  @ViewChild('clips') masonry?: NgxMasonryComponent;
  // @ViewChildren('clipsListItems') clipsListItems?: QueryList<ElementRef>;

  trendingResults$ = this.dataService.getClipsResults$();
  totalCount = 0;
  detailData?: ReducedData;

  private readonly destroy$ = new Subject<void>();

  constructor(private giphyService: GiphyService, private dataService: DataService, private loaderService: LoaderService, public router: Router, private dataTransformerService: DataTransformerService) { }

  ngOnInit(): void {
    this.giphyService.getTrendingClips()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.totalCount = reducedTrendingResults.pagination.total_count;
      this.dataService.setClipsResults$(reducedTrendingResults);
    })

    combineLatest([
      this.dataService.getClipsResults$(),
      this.dataService.getFavoriteItems$()
    ])
    .pipe(
      map((result) => this.dataTransformerService.updateFavoriteStatusInitial(result[0], result[1])),
      // tap(() => {console.log("Clips combinelatest")}),
      takeUntil(this.destroy$)
    )
    .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(reducedData: ReducedData): void {
    this.dataService.addFavoriteItem$(reducedData);
  }

  selectItem(selectedItem: ReducedData): void {
    this.dataService.setSelectedItem$(selectedItem);
  }

  loadNextBatch() {
    if(this.loaderService.isLoading.getValue() === false) {
      this.giphyService.getNextItems("clips", environment.gTrendingClipsUrl);
    }
  }

  // TODO: FUTURE TASK, SHOW MP4 ON HOVER
  // playVideo(index: number): void {
  //   if(this.clipsListItems !== undefined) {
  //     let hoveredItem = this.clipsListItems.toArray()[index];
      
  //     hoveredItem.nativeElement.volume = 0.5;
  //     hoveredItem.nativeElement.muted = false;
  //     hoveredItem.nativeElement.play();
  //   }
  // }
  
  // stopVideo(index: number): void {
  //   if(this.clipsListItems !== undefined) {
  //     let hoveredItem = this.clipsListItems.toArray()[index];
      
  //     hoveredItem.nativeElement.volume = 0.5;
  //     hoveredItem.nativeElement.muted = true;
  //     hoveredItem.nativeElement.pause();
  //   }
  // }

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
