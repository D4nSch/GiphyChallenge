import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LayoutUpdateService } from '../services/layout-update.service';

@Component({
  selector: 'app-trending-carousel',
  templateUrl: './trending-carousel.component.html',
  styleUrls: ['./trending-carousel.component.scss']
})
export class TrendingCarouselComponent implements OnInit {

  trendingResults$ = this.dataService.getTrendingResults$();

  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService, private giphyService: GiphyService, private layoutUpdateService: LayoutUpdateService) { }

  ngOnInit(): void {
    this.giphyService.getTrendingGifs()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.dataService.setTrendingResults$(reducedTrendingResults);
    });
  }

  setFavorite(item: ReducedData): void {
    this.dataService.addFavoriteItem$(item);
    this.layoutUpdateService.setLayoutUpdate$(true);
  }
}
