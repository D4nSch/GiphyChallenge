import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, delay, map, take, tap } from 'rxjs';
import { GiphyResponseGifs, GiphyResponseClips, ReducedData } from '../models/giphyresponse';
import { DataService } from './data.service';
import { LoaderService } from './loader.service';
import { NotificationService } from './notification.service';
import { DataTransformerService } from './data-transformer.service';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  router: any;

  searchQuery = "";
  result: ReducedData[] = [];
  // GIFs per search/scroll
  limit = 25;
  offset = 0;
  totalCount = 0;

  constructor(private http: HttpClient, private dataservice: DataService, private loaderService: LoaderService, private notificationService: NotificationService, private dataTransformerService: DataTransformerService) { }
  
  getSearchGifs(searchQuery: string) {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('q', searchQuery)
    .set('limit', this.limit)
    .set('offset', 0);
    
    return this.http.get<GiphyResponseGifs>(environment.gSearchGifsUrl, {params})
    .pipe(
      // tap((giphyResponse) => {
      //   console.group("%c GifIt: Search | giphyResponse "+"", "color: #43F2A7");
      //     console.log(giphyResponse)
      //   console.groupEnd();
      // }),
      map((giphyResponse) => this.dataTransformerService.reduceGiphyResponseGifs(giphyResponse)),
        tap((reducedGiphyResponse) => {
          this.searchQuery = searchQuery;
          this.result = [...reducedGiphyResponse.images]
          this.offset = reducedGiphyResponse.pagination.count+reducedGiphyResponse.pagination.offset;
          this.totalCount = reducedGiphyResponse.pagination.total_count;
        })
    );
  }

  getTrendingGifs() {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('limit', this.limit)
    .set('offset', this.offset);
    
    return this.http.get<GiphyResponseGifs>(environment.gTrendingGifsUrl, {params})
    .pipe(
      // tap((giphyResponse) => {
      //   console.group("%c GifIt: Trending Gifs | giphyResponse "+"", "color: #43F2A7");
      //     console.log(giphyResponse)
      //   console.groupEnd();
      // }),
      map((giphyResponse) => this.dataTransformerService.reduceGiphyResponseGifs(giphyResponse)),
        tap((reducedGiphyResponse) => {
          this.result = [...reducedGiphyResponse.images]
          this.offset = reducedGiphyResponse.pagination.count+reducedGiphyResponse.pagination.offset;
          this.totalCount = reducedGiphyResponse.pagination.total_count;
        })
    );
  }

  getTrendingClips() {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('limit', this.limit)
    .set('offset', this.offset);
    
    return this.http.get<GiphyResponseClips>(environment.gTrendingClipsUrl, {params})
    .pipe(
      // tap((giphyResponse) => {
      //   console.group("%c GifIt: Trending Clips | giphyResponse "+"", "color: #43F2A7");
      //     console.log(giphyResponse)
      //   console.groupEnd();
      // }),
      map((giphyResponse) => this.dataTransformerService.reduceGiphyResponseClips(giphyResponse)),
        tap((reducedGiphyResponse) => {
          this.result = [...reducedGiphyResponse.images]
          this.offset = reducedGiphyResponse.pagination.count+reducedGiphyResponse.pagination.offset;
          this.totalCount = reducedGiphyResponse.pagination.total_count;
        })
    );
  }
    
  getNextItems(category: string, url: string) {
    let params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('limit', this.limit)
    .set('offset', this.offset);
    
    if(category ===  "search") {
      params = params.append('q', this.searchQuery)
    } 
    
    if(this.totalCount !== this.offset) {
      this.http.get<GiphyResponseGifs | GiphyResponseClips>(url, {params})
      .pipe(
        // tap((giphyResponse) => {
        //   console.group("%c GifIt: Scroll | giphyResponse "+"", "color: #43F2A7");
        //     console.log(giphyResponse);
        //   console.groupEnd();
        // }),
        map((giphyResponse) => {
          if(category === "search" || category === "trending") {
            return this.dataTransformerService.reduceGiphyResponseGifs(giphyResponse as GiphyResponseGifs);
          } else {
            return this.dataTransformerService.reduceGiphyResponseClips(giphyResponse as GiphyResponseClips);
          }
        }),
        tap((reducedGiphyResponse) => {
          // Concat should be faster, because it's both an array
          this.result = this.result.concat(reducedGiphyResponse.images);
          // this.searchResult = [...this.searchResult, ...reducedGiphyResponse.images];
          this.offset = this.offset+reducedGiphyResponse.images.length;
          this.loaderService.show();
        }),
        debounceTime(1000),
        delay(this.loaderService.showLoaderTime),
        take(1)
      )
      .subscribe(async (reducedGiphyResponse) => {
        reducedGiphyResponse.images = this.result;

        this.loaderService.hide();
        switch (category) {
          case "search":
            this.dataservice.setSearchResults$(reducedGiphyResponse);
            break;
          case "trending":
            this.dataservice.setTrendingResults$(reducedGiphyResponse);
            break;
          case "clips":
            this.dataservice.setClipsResults$(reducedGiphyResponse);
            break;
          default:
            break;
        }
      });
    } else {
      this.notificationService.toastNotification("You've reached the end of this search. No more GIFs/Clips available. Try a new query.")
    }
  }
}
