import { Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LayoutUpdateService } from '../services/layout-update.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-clips',
  templateUrl: './clips.component.html',
  styleUrls: ['./clips.component.scss'],
  providers: [GiphyService]
})
export class ClipsComponent implements OnInit {
  @ViewChild('clips') masonry?: NgxMasonryComponent;
  @ViewChildren('clipsListItems') clipsListItems?: QueryList<ElementRef>;

  trendingResults$ = this.dataservice.getClipsResults$();
  
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

    this.giphyService.getTrendingClips()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.dataservice.setClipsResults$(reducedTrendingResults);
      this.layoutUpdateService.setLayoutUpdate$(true);
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(reducedData: ReducedData): void {
    this.dataservice.addFavoriteItem$(reducedData);
    this.layoutUpdateService.setLayoutUpdate$(true);
  }

  loadNextBatch() {
    if(this.loaderService.isLoading.getValue() === false) {
      this.giphyService.getNextItems("search", environment.gSearchGifsUrl);
    }
  }

  playVideo(index: number): void {
    if(this.clipsListItems !== undefined) {
      let hoveredItem = this.clipsListItems.toArray()[index];

      hoveredItem.nativeElement.muted = false;
      hoveredItem.nativeElement.play();
    }
  }
  
  stopVideo(index: number): void {
    if(this.clipsListItems !== undefined) {
      let hoveredItem = this.clipsListItems.toArray()[index];
      
      hoveredItem.nativeElement.muted = true;
      hoveredItem.nativeElement.pause();
    }
  }

  // ngx-masonry seems to have trouble with undefined heights (overlapping)
  fixLayout() {
    if (this.masonry !== undefined) {
      // this.masonry.reloadItems();
      this.masonry.layout();
    }
  }
}
