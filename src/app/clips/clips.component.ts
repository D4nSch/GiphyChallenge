import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData } from '../models/giphyresponse';
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

  trendingResults$ = this.dataservice.getClipsResults$();
  totalCount = 0;
  detailData?: ReducedData;

  private readonly destroy$ = new Subject<void>();

  constructor(private giphyService: GiphyService, private dataservice: DataService, private loaderService: LoaderService, public router: Router) { }

  ngOnInit(): void {
    this.giphyService.getTrendingClips()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.totalCount = reducedTrendingResults.pagination.total_count;
      this.dataservice.setClipsResults$(reducedTrendingResults);
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(reducedData: ReducedData): void {
    this.dataservice.addFavoriteItem$(reducedData);
  }

  selectItem(selectedItem: ReducedData): void {
    this.dataservice.setSelectedItem$(selectedItem);
  }

  loadNextBatch() {
    if(this.loaderService.isLoading.getValue() === false) {
      this.giphyService.getNextItems("clips", environment.gTrendingClipsUrl);
    }
  }

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
