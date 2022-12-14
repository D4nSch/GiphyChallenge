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
import { NgxMasonryModule } from 'ngx-masonry';
import { LoaderComponent } from './loader/loader.component';
import { IvyCarouselModule } from 'angular-responsive-carousel2';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmBoxConfigModule, DialogConfigModule, NgxAwesomePopupModule, ToastNotificationConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { AngularResizeEventModule } from 'angular-resize-event';
import { DetailViewComponent } from './detail-view/detail-view.component';

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
    LoaderComponent,
    DetailViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMasonryModule,
    InfiniteScrollModule,
    IvyCarouselModule,
    NgxAwesomePopupModule.forRoot(),
    ToastNotificationConfigModule.forRoot({
      globalSettings: {
        allowedNotificationsAtOnce: 5
    }}),
    DialogConfigModule.forRoot(),
    ConfirmBoxConfigModule.forRoot(),
    ToastNotificationConfigModule.forRoot(),
    AngularResizeEventModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
