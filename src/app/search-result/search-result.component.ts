import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LoaderService } from '../services/loader.service';
import { NgxMasonryComponent } from 'ngx-masonry';
import { ReducedData } from '../models/giphyresponse';
import { environment } from '../../environments/environment';
import { LayoutUpdateService } from '../services/layout-update.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  providers: [GiphyService]
})
export class SearchResultComponent implements OnInit, OnDestroy {
  @ViewChild('searchresult') masonry?: NgxMasonryComponent;
  
  @HostListener('window:scroll')
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      // Prevent multiple loads
      if(this.loaderService.isLoading.getValue() === false) {
        this.giphyService.getNextItems("search", environment.gSearchGifsUrl);
      }
    }
  }

  searchResults$ = this.dataservice.getSearchResults$();
  searchQuery$ = this.dataservice.getSearchQuery$();
  totalCount = 0;

  private readonly destroy$ = new Subject<void>();

  constructor(private dataservice: DataService, private giphyService: GiphyService, private loaderService: LoaderService, private layoutUpdateService: LayoutUpdateService) { }
  
  ngOnInit() {
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

    this.dataservice.getSearchQuery$()
    .pipe(
      filter((searchQuery) => searchQuery !== ""),
      switchMap((searchQuery) => this.giphyService.getSearchGifs(searchQuery)),
      takeUntil(this.destroy$)
    )
    .subscribe((reducedSearchResults) => {
      console.group("%c GifIt: reducedSearchResults "+"", "color: #43F2A7");
        console.log(reducedSearchResults);
      console.groupEnd();
      
      this.totalCount = reducedSearchResults.pagination.total_count;
      this.dataservice.setSearchResults$(reducedSearchResults);
      this.layoutUpdateService.setLayoutUpdate$(true);
    });
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