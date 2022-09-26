import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReducedData, ReducedGiphyResponse } from '../models/giphyresponse';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor() { }

  private searchQuery$: BehaviorSubject<string> = new BehaviorSubject("");
  // ReplaySubject(1) doesn't have an initial value until it is set with next, but emits last value on subscription
  // private searchResult$: Subject<GiphyResponse> = new ReplaySubject<GiphyResponse>(1);
  private searchResults$: Subject<ReducedGiphyResponse> = new Subject<ReducedGiphyResponse>;
  private trendingResults$: Subject<ReducedGiphyResponse> = new Subject<ReducedGiphyResponse>;
  private clipsResults$: Subject<ReducedGiphyResponse> = new Subject<ReducedGiphyResponse>;

  private favoriteItems$: BehaviorSubject<ReducedData[]> = new BehaviorSubject<ReducedData[]>(JSON.parse(localStorage.getItem("favoriteItemsList")?.length ? localStorage.getItem("favoriteItemsList")! : "[]"));

  getFavoriteItems$(): Observable<ReducedData[]> {
    return this.favoriteItems$.asObservable();
  }

  addFavoriteItem$(favoriteItem: ReducedData) {
    let duplicateItemsList = this.favoriteItems$.getValue().filter(item => item.id === favoriteItem.id);

    if(duplicateItemsList.length === 0) {
      let newFavoriteItemsList = this.favoriteItems$.getValue().concat(favoriteItem);
      
      localStorage.setItem("favoriteItemsList", JSON.stringify(newFavoriteItemsList));
      this.favoriteItems$.next(newFavoriteItemsList);
    } else {
      //TODO: add notification
      console.log("GIF already in favorites!");
    }
  }

  removeFavoriteItem$(favoriteItem: ReducedData) {
    let newFavoriteItemsList = this.favoriteItems$.getValue().filter(item => item.id !== favoriteItem.id);

    localStorage.setItem("favoriteItemsList", JSON.stringify(newFavoriteItemsList));
    this.favoriteItems$.next(newFavoriteItemsList);

    //TODO: add notification
    console.log("GIF removed from favorites!");
  }

  getClipsResults$(): Observable<ReducedGiphyResponse> {
    return this.clipsResults$.asObservable();
  }

  setClipsResults$(clipsResults: ReducedGiphyResponse) {
    this.clipsResults$.next(clipsResults);
  }

  getTrendingResults$(): Observable<ReducedGiphyResponse> {
    return this.trendingResults$.asObservable();
  }

  setTrendingResults$(trendingResults: ReducedGiphyResponse) {
    this.trendingResults$.next(trendingResults);
  }

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
