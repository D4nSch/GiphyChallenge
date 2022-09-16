import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, GiphyResponse, ReducedGif } from '../models/giphyresponse';
import { DataService } from './data.service';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiphyService {
  router: any;

  constructor(private http: HttpClient, private dataservice: DataService) { }

  getTrendingGifs(limit: number, offset: number) {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('limit', limit)
    .set('offset', offset);
    
    return this.http.get<GiphyResponse>(environment.gTrendingGifsUrl, {params});
  }

  getSearchGifs(searchQuery: string, limit: number, offset: number) {
    const params = new HttpParams()
    .set('api_key', environment.gApiKey)
    .set('q', searchQuery)
    .set('limit', limit)
    .set('offset', offset);
    
    return this.http.get<GiphyResponse>(environment.gSearchGifsUrl, {params}).pipe(
      tap((giphyResponse) => {
        console.group("%c GifIt: giphyResponse "+"", "color: #43F2A7");
          console.log(giphyResponse)
        console.groupEnd();
      }),
      map((giphyResponse) => this.reduceGiphyResponse(giphyResponse))
    );
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
