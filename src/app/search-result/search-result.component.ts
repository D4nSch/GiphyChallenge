import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DataService } from '../services/data.service';
import { GiphyService } from '../services/giphy.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {

  searchQuery$ = this.dataservice.getSearchQuery$();
  searchResults$ = this.dataservice.getSearchResults$();

  private readonly destroy$ = new Subject<void>();
  
  constructor(private dataservice: DataService, private giphyService: GiphyService) { }
  
  ngOnInit() {
    this.dataservice.getSearchQuery$()
    .pipe(
      filter((searchQuery) => searchQuery !== ""),
      switchMap((searchQuery) => this.giphyService.getSearchGifs(searchQuery, 50, 0)),
      takeUntil(this.destroy$)
    )
    .subscribe((reducedSearchResults) => {
      console.group("%c GifIt: reducedSearchResults "+"", "color: #43F2A7");
        console.log(reducedSearchResults);
      console.groupEnd();

      this.dataservice.setSearchResults$(reducedSearchResults);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}