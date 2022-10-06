import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, forkJoin, map, mergeMap, Subject, takeUntil, tap } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchQuery = new FormControl();
  private readonly destroy$ = new Subject<void>();

  constructor(private router: Router, private dataservice: DataService) { }

  ngOnInit() {
    this.searchQuery.valueChanges
    .pipe(
      map((searchQuery) => searchQuery.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      filter((searchQuery) => searchQuery !== ""),
      takeUntil(this.destroy$)
    )
    .subscribe((searchQuery) => {
      console.group("%c GifIt: searchQuery "+"", "color: #43F2A7");
        console.log(searchQuery);
        // console.log(typeof(searchQuery));
      console.groupEnd();

      this.dataservice.setSearchQuery$(searchQuery);
      this.router.navigate(['search', searchQuery.replace(/ /g, "-")]);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    localStorage.removeItem("searchQuery");
  }
}
