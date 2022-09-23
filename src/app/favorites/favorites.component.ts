import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxMasonryComponent } from 'ngx-masonry';
import { ReducedGif } from '../models/giphyresponse';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  @ViewChild('favorites') masonry?: NgxMasonryComponent;
  
  favoriteGifs$ = this.dataservice.getFavoriteGifs$();

  constructor(private dataservice: DataService) { }

  ngOnInit(): void {
  }

  removeFavorite(reducedGif: ReducedGif): void {
    this.dataservice.removeFavoriteGif$(reducedGif);
  }

  // ngx-masonry seems to have trouble with undefined heights (overlapping)
  fixLayout() {
    if (this.masonry !== undefined) {
      // this.masonry.reloadItems();
      this.masonry.layout();
    }
  }
}
