import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReducedData, ReducedGiphyResponse } from '../models/giphyresponse';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private notificationService: NotificationService) { }

  private searchQuery$ = new BehaviorSubject("");
  // ReplaySubject(1) doesn't have an initial value until it is set with next, but emits last value on subscription
  // private searchResult$: Subject<GiphyResponse> = new ReplaySubject<GiphyResponse>(1);
  private searchResults$ = new Subject<ReducedGiphyResponse>;
  private trendingResults$ = new Subject<ReducedGiphyResponse>;
  private clipsResults$ = new Subject<ReducedGiphyResponse>;
  
  private selectedItem$ = new Subject<ReducedData | undefined>;

  private favoriteItems$ = new BehaviorSubject<ReducedData[]>(JSON.parse(localStorage.getItem("favoriteItemsList")?.length ? localStorage.getItem("favoriteItemsList")! : "[]"));

  getFavoriteItems$(): Observable<ReducedData[]> {
    return this.favoriteItems$.asObservable();
  }

  clearFavoriteItems$(): void {
    if(this.favoriteItems$.getValue().length !== 0) {
      localStorage.setItem("favoriteItemsList", JSON.stringify([]));
      this.favoriteItems$.next([]);

      this.notificationService.toastNotification("All favorite GIFs/Clips cleared!");
    } else {
      this.notificationService.toastNotification("No favorite GIFs/Clips to clear!");
    }
  }
  
  addFavoriteItem$(favoriteItem: ReducedData) {
    let duplicateItemsList = this.favoriteItems$.getValue().filter(item => item.id === favoriteItem.id);
    
    if(duplicateItemsList.length === 0) {
      let newFavoriteItemsList = this.favoriteItems$.getValue().concat(favoriteItem);
      
      localStorage.setItem("favoriteItemsList", JSON.stringify(newFavoriteItemsList));
      this.favoriteItems$.next(newFavoriteItemsList);

      this.notificationService.toastNotification("GIF/Clip added to favorites!");
    } else {
      this.notificationService.toastNotification("GIF/Clip is already a favorite!");
    }
  }
  
  removeFavoriteItem$(favoriteItem: ReducedData) {
    let newFavoriteItemsList = this.favoriteItems$.getValue().filter(item => item.id !== favoriteItem.id);
    
    localStorage.setItem("favoriteItemsList", JSON.stringify(newFavoriteItemsList));
    this.favoriteItems$.next(newFavoriteItemsList);
    
    this.notificationService.toastNotification("GIF/Clip removed from favorites!");
  }

  getSelectedItem$(): Observable<ReducedData | undefined> {
    return this.selectedItem$.asObservable();
  }

  setSelectedItem$(selectedItem: ReducedData | undefined) {
    this.selectedItem$.next(selectedItem);
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
