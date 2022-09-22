import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReducedGif, ReducedGiphyResponse } from '../models/giphyresponse';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor() { }

  private searchQuery$: BehaviorSubject<string> = new BehaviorSubject("");
  // ReplaySubject(1) doesn't have an initial value until it is set with next, but emits last value on subscription
  // private searchResult$: Subject<GiphyResponse> = new ReplaySubject<GiphyResponse>(1);
  private searchResults$: Subject<ReducedGiphyResponse> = new Subject<ReducedGiphyResponse>;
  private favoriteGifs$: BehaviorSubject<ReducedGif[]> = new BehaviorSubject<ReducedGif[]>(JSON.parse(localStorage.getItem("favoriteGifsList")?.length ? localStorage.getItem("favoriteGifsList")! : "[]"));

  getFavoriteGifs$(): Observable<ReducedGif[]> {
    return this.favoriteGifs$.asObservable();
  }

  addFavoriteGif$(favoriteGif: ReducedGif) {
    let newFavoriteGifsList = this.favoriteGifs$.getValue().concat(favoriteGif);

    localStorage.setItem("favoriteGifsList", JSON.stringify(newFavoriteGifsList));
    this.favoriteGifs$.next(this.favoriteGifs$.getValue().concat(favoriteGif));
  }

  removeFavoriteGif$(favoriteGif: ReducedGif) {
    let newFavoriteGifsList = this.favoriteGifs$.getValue().filter(gifEntry => gifEntry.id !== favoriteGif.id);

    localStorage.setItem("favoriteGifsList", JSON.stringify(newFavoriteGifsList));
    this.favoriteGifs$.next(newFavoriteGifsList);
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
