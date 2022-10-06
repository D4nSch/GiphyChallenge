import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';

@Component({
  selector: 'app-trending-carousel',
  templateUrl: './trending-carousel.component.html',
  styleUrls: ['./trending-carousel.component.scss']
})
export class TrendingCarouselComponent implements OnInit {

  trendingResults$ = this.dataService.getTrendingResults$();

  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService, private giphyService: GiphyService) { }

  ngOnInit(): void {
    this.giphyService.getTrendingGifs()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((reducedTrendingResults) => {
      this.dataService.setTrendingResults$(reducedTrendingResults);
    });
  }
}
