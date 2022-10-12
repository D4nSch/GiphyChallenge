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
  muteClip = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getSelectedItem$()
    .pipe(
      takeUntil(this.destroy$)
    ).
    subscribe((result) => {
      this.detailData = result;
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
    this.muteClip = false;
    this.dataService.setSelectedItem$(selectedItem);
  }

  setFavorite(reducedData: ReducedData): void {
    this.dataService.addFavoriteItem$(reducedData);
  }
}

