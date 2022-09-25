import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClipsComponent } from './clips/clips.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { TrendingCarouselComponent } from './trending-carousel/trending-carousel.component';
import { TrendingGifsOverviewComponent } from './trending-gifs-overview/trending-gifs-overview.component';

const routes: Routes = [
  { path:'', component: TrendingCarouselComponent },
  { path:'', component: ClipsComponent, pathMatch: 'full', outlet: 'addition' },
  { path:'trending-gifs', component: TrendingGifsOverviewComponent },
  { path:'clips', component: ClipsComponent },
  { path:'search/:searchQuery', component: SearchResultComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
