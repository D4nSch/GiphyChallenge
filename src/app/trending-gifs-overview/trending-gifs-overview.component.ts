import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReducedGif } from '../models/giphyresponse';
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

  @HostListener('window:scroll')
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      // Prevent multiple loads
      if(this.loaderService.isLoading.getValue() === false) {
        this.giphyService.getNextGifs("trending", environment.gTrendingGifsUrl);
      }
    }
  }

  trendingResults$ = this.dataservice.getTrendingResults$();
  
  private readonly destroy$ = new Subject<void>();

  constructor(private giphyService: GiphyService, private dataservice: DataService, private loaderService: LoaderService) { }

  ngOnInit(): void {

    this.giphyService.getTrendingGifs()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.dataservice.setTrendingResults$(reducedTrendingResults);
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFavorite(reducedGif: ReducedGif): void {
    this.dataservice.addFavoriteGif$(reducedGif);
  }

  // ngx-masonry seems to have trouble with undefined heights (overlapping)
  fixLayout() {
    if (this.masonry !== undefined) {
      // this.masonry.reloadItems();
      this.masonry.layout();
    }
  }
}
