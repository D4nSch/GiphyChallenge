import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { GiphyResponse, ReducedGiphyResponse } from '../models/giphyresponse';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor() { }

  private searchQuery$: BehaviorSubject<string> = new BehaviorSubject("");
  // ReplaySubject(1) doesn't have an initial value until it is set with next, but emits last value on subscription
  // private searchResult$: Subject<GiphyResponse> = new ReplaySubject<GiphyResponse>(1);
  private searchResults$: Subject<ReducedGiphyResponse> = new Subject<ReducedGiphyResponse>;

  getSearchResults$(): Observable<ReducedGiphyResponse> {
    return this.searchResults$.asObservable();
  }

  setSearchResults$(searchResults: ReducedGiphyResponse) {
    this.searchResults$.next(searchResults);
  }
  
  getSearchQuery$(): Observable<string> {
    return this.searchQuery$.asObservable();
  }

  setSearchQuery$(searchQuery: string) {
    this.searchQuery$.next(searchQuery);
  }
}
