import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, take, tap } from 'rxjs';
import { GiphyResponse, ReducedGif } from '../models/giphyresponse';
import { DataService } from './data.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  router: any;

  searchQuery = "";
  result: ReducedGif[] = [];
  // GIFs per search/scroll
  limit = 25;
  offset = 0;
  totalCount = 0;
  showLoaderTime = 750;

  constructor(private http: HttpClient, private dataservice: DataService, private loaderService: LoaderService) { }
  
  getSearchGifs(searchQuery: string) {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('q', searchQuery)
    .set('limit', this.limit)
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
    
    return this.http.get<GiphyResponse>(environment.gTrendingGifsUrl, {params})
    .pipe(
      tap((giphyResponse) => {
        console.group("%c GifIt: Trending | giphyResponse "+"", "color: #43F2A7");
          console.log(giphyResponse)
        console.groupEnd();
      }),
      map((giphyResponse) => this.reduceGiphyResponse(giphyResponse)),
      tap((reducedGiphyResponse) => {
        this.result = [...reducedGiphyResponse.images]
        this.offset = reducedGiphyResponse.pagination.count+reducedGiphyResponse.pagination.offset;
        this.totalCount = reducedGiphyResponse.pagination.total_count;
      })
    );
  }
    
  getNextGifs(category: string, url: string) {
    let params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('limit', this.limit)
    .set('offset', this.offset);
    
    if(category ===  "search") {
      params = params.append('q', this.searchQuery)
    } 
    
    if(this.totalCount !== this.offset) {
      this.http.get<GiphyResponse>(url, {params}).pipe(
        tap((giphyResponse) => {
          console.group("%c GifIt: Scroll | giphyResponse "+"", "color: #43F2A7");
            console.log(giphyResponse);
          console.groupEnd();
        }),
        map((giphyResponse) => this.reduceGiphyResponse(giphyResponse)),
        tap((reducedGiphyResponse) => {
          // Concat should be faster, because it's both an array
          this.result = this.result.concat(reducedGiphyResponse.images);
          // this.searchResult = [...this.searchResult, ...reducedGiphyResponse.images];
          this.offset = this.offset+reducedGiphyResponse.images.length;
          this.loaderService.show();
        }),
        take(1)
      )
      .subscribe(async (reducedGiphyResponse) => {
        reducedGiphyResponse.images = this.result;

        await new Promise(resolve => setTimeout(resolve, this.showLoaderTime)).then(() => {
          this.loaderService.hide();
          switch (category) {
            case "search":
              this.dataservice.setSearchResults$(reducedGiphyResponse);
              break;
            case "trending":
              this.dataservice.setTrendingResults$(reducedGiphyResponse);
              break;
            default:
              break;
          }
        });
      });
    } else {
      console.log("No more gifs with this search query available!");
    }
  }

  // stripping the GiphyResponse of unnecessary stuff
  reduceGiphyResponse(giphyResponse: GiphyResponse) {
    let reducedGifContainer: ReducedGif[] = [];

    giphyResponse.data.forEach(gifItem => {
      let reducedGifItem = {
        "title": gifItem.title,
        "id": gifItem.id,
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
