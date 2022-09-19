import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, GiphyResponse, ReducedGif } from '../models/giphyresponse';
import { DataService } from './data.service';
import { map, tap } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  router: any;

  searchQuery = "";
  searchResult: ReducedGif[] = [];
  // GIFs per search/scroll
  searchLimit = 35;
  searchOffset = 0;
  showLoaderTime = 750;

  constructor(private http: HttpClient, private dataservice: DataService, private loaderService: LoaderService) { }

  getTrendingGifs(limit: number, offset: number) {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('limit', limit)
    .set('offset', offset);
    
    return this.http.get<GiphyResponse>(environment.gTrendingGifsUrl, {params});
  }

  getSearchGifs(searchQuery: string) {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('q', searchQuery)
    .set('limit', this.searchLimit)
    .set('offset', 0);
    
    return this.http.get<GiphyResponse>(environment.gSearchGifsUrl, {params})
    .pipe(
      tap((giphyResponse) => {
        console.group("%c GifIt: Search | giphyResponse "+"", "color: #43F2A7");
          console.log(giphyResponse)
        console.groupEnd();
      }),
      map((giphyResponse) => this.reduceGiphyResponse(giphyResponse)),
      tap((reducedGiphyResponse) => {
        this.searchQuery = searchQuery;
        this.searchResult = [...reducedGiphyResponse.images]
        this.searchOffset = reducedGiphyResponse.pagination.count+reducedGiphyResponse.pagination.offset;
      })
    );
  }
    
  getNextGifs() {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('q', this.searchQuery)
    .set('limit', this.searchLimit)
    .set('offset', this.searchOffset);
    
    this.http.get<GiphyResponse>(environment.gSearchGifsUrl, {params}).pipe(
      tap((giphyResponse) => {
        console.group("%c GifIt: Scroll | giphyResponse "+"", "color: #43F2A7");
          console.log(giphyResponse)
        console.groupEnd();
      }),
      map((giphyResponse) => this.reduceGiphyResponse(giphyResponse)),
      tap((reducedGiphyResponse) => {
        // Concat should be faster, because it's both an array
        this.searchResult = this.searchResult.concat(reducedGiphyResponse.images);
        // this.searchResult = [...this.searchResult, ...reducedGiphyResponse.images];
        this.searchOffset = this.searchOffset+reducedGiphyResponse.images.length;
        this.loaderService.show();
      })
    )
    .subscribe(async (reducedGiphyResponse) => {
      reducedGiphyResponse.images = this.searchResult;

      await new Promise(resolve => setTimeout(resolve, this.showLoaderTime)).then(() => {
        this.loaderService.hide();
        this.dataservice.setSearchResults$(reducedGiphyResponse);
      });
    });
  }

  // stripping the GiphyResponse of unnecessary stuff
  reduceGiphyResponse(giphyResponse: GiphyResponse) {
    let reducedGifContainer: ReducedGif[] = [];

    giphyResponse.data.forEach(gifItem => {
      let reducedGifItem = {
        "title": gifItem.title,
        "preview": gifItem.images["preview"],
        "original": gifItem.images["original"]
      }

      reducedGifContainer.push(reducedGifItem);
    });

    return {
      images: reducedGifContainer,
      pagination: giphyResponse.pagination,
      meta: giphyResponse.meta
    }
  }
}
