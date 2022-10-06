import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { combineLatest, forkJoin, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ReducedData } from '../models/giphyresponse';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @ViewChild('detailViewItem') detailViewItem?: ElementRef;
  
  detailData?: ReducedData;
  alreadyFavorite = false;
  muteClip = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getSelectedItem$()
    .pipe(
      switchMap((selectedItemData) => {
        return combineLatest([of(selectedItemData), this.dataService.getFavoriteItems$()]);
      }),
      takeUntil(this.destroy$)
    ).
    subscribe((results) => {
      let duplicateItemsList = results[1].filter(item => item.id === results[0]?.id);
      if(duplicateItemsList.length > 0) {
        this.alreadyFavorite = true;
      }
      
      console.log(this.alreadyFavorite);
      this.detailData = results[0];
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  volumeTrigger(): void {
    this.muteClip = !this.muteClip;
    let selectedClip = this.detailViewItem?.nativeElement;

    selectedClip.muted = this.muteClip;
  }

  deselectItem(selectedItem: ReducedData | undefined): void {
    this.alreadyFavorite = false;
    this.muteClip = false;
    this.dataService.setSelectedItem$(selectedItem);
  }

  setFavorite(reducedData: ReducedData): void {
    this.dataService.addFavoriteItem$(reducedData);
  }
}
function mergemap(arg0: (selectedItemData: any) => import("rxjs").Observable<[unknown, ReducedData[]]>): import("rxjs").OperatorFunction<ReducedData | undefined, unknown> {
  throw new Error('Function not implemented.');
}

