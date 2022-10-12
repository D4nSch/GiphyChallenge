import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { combineLatest, filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LoaderService } from '../services/loader.service';
import { NgxMasonryComponent } from 'ngx-masonry';
import { ReducedData } from '../models/giphyresponse';
import { environment } from '../../environments/environment';
import { DataTransformerService } from '../services/data-transformer.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [GiphyService]
})
export class SearchResultComponent implements OnInit, OnDestroy {
  @ViewChild('searchresult') masonry?: NgxMasonryComponent;

  searchResults$ = this.dataService.getSearchResults$();
  searchQuery$ = this.dataService.getSearchQuery$();
  totalCount = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService, private giphyService: GiphyService, private loaderService: LoaderService, private dataTransformerService: DataTransformerService) { }
  
  ngOnInit() {
    this.dataService.getSearchQuery$()
    .pipe(
      filter((searchQuery) => searchQuery !== ""),
      switchMap((searchQuery) => this.giphyService.getSearchGifs(searchQuery)),
      takeUntil(this.destroy$)
    )
    .subscribe((reducedSearchResults) => {
      this.totalCount = reducedSearchResults.pagination.total_count;
      this.dataService.setSearchResults$(reducedSearchResults);
    });

    combineLatest([
      this.dataService.getSearchResults$(),
      this.dataService.getFavoriteItems$()
    ])
    .pipe(
      map((result) => this.dataTransformerService.updateFavoriteStatusInitial(result[0], result[1])),
      // tap(() => {console.log("SearchResult combinelatest")}),
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
      this.giphyService.getNextItems("search", environment.gSearchGifsUrl);
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