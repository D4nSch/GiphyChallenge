import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingGifsOverviewComponent } from './trending-gifs-overview.component';

describe('TrendingGifsOverviewComponent', () => {
  let component: TrendingGifsOverviewComponent;
  let fixture: ComponentFixture<TrendingGifsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingGifsOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingGifsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
