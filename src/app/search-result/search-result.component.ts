import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {

  searchResults$ = this.dataservice.getSearchResults$();
  searchQuery$ = this.dataservice.getSearchQuery$();
  totalCount = 0;

  isLoading = this.loaderService.isLoading;

  private readonly destroy$ = new Subject<void>();

  @HostListener('window:scroll')
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      this.giphyService.getNextGifs();
    }
  }

  constructor(private dataservice: DataService, private giphyService: GiphyService, private loaderService: LoaderService) { }
  
  ngOnInit() {
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
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}