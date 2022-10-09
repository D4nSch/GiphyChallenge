import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { GiphyResponseClips, GiphyResponseGifs, ReducedData, ReducedGiphyResponse } from '../models/giphyresponse';

@Injectable({
  providedIn: 'root'
})
export class DataTransformerService {

  constructor() { }

  // stripping the GiphyResponse of unnecessary stuff
  reduceGiphyResponseGifs(giphyResponse: GiphyResponseGifs) {
    let reducedDataContainer: ReducedData[] = [];

    giphyResponse.data.forEach(item => {
      let reducedItem = {
        "title": item.title,
        "id": item.id,
        "preview": item.images["fixed_width"].webp,
        "original": item.images["fixed_width"].url,
        "type": item.type,
        "favorite": false
      }

      reducedDataContainer.push(reducedItem);
    });

    return {
      images: reducedDataContainer,
      pagination: giphyResponse.pagination,
      meta: giphyResponse.meta
    }
  }

  // same for clips
  reduceGiphyResponseClips(giphyResponse: GiphyResponseClips) {
    let reducedDataContainer: ReducedData[] = [];

    giphyResponse.data.forEach(item => {
      let reducedItem = {
        "title": item.title,
        "id": item.id,
        "preview": item.images["fixed_width"].url,
        "original": item.video.assets["360p"].url,
        "type": item.type,
        "favorite": false
      }

      reducedDataContainer.push(reducedItem);
    });

    return {
      images: reducedDataContainer,
      pagination: giphyResponse.pagination,
      meta: giphyResponse.meta
    }
  }

  updateFavoriteStatusInitial(reducedGiphyResponse: ReducedGiphyResponse, favoriteItems: ReducedData[]) {
    let updatedReducedGiphyResponse = reducedGiphyResponse;

    updatedReducedGiphyResponse.images.forEach(gifclip => {      
      let favorite = favoriteItems.find(favoriteItem => favoriteItem.id === gifclip.id);
      
      if(favorite) {
        gifclip.favorite = true;
      } else {
        gifclip.favorite = false;
      }
    });

    return updatedReducedGiphyResponse;
  }
}
