import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { TrendingCarouselComponent } from './trending-carousel/trending-carousel.component';
import { TrendingGifsOverviewComponent } from './trending-gifs-overview/trending-gifs-overview.component';
import { ClipsComponent } from './clips/clips.component';
import { SearchComponent } from './navbar/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FavoritesComponent,
    SearchResultComponent,
    TrendingCarouselComponent,
    TrendingGifsOverviewComponent,
    ClipsComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
