import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutUpdateService {

  tries = 10;
  pauseTime = 150;
  private layoutUpdateTrigger$: Subject<boolean> = new Subject;

  constructor() { }

  setLayoutUpdate$(updateState: boolean) {
    this.layoutUpdateTrigger$.next(updateState);
  }

  getLayoutUpdateTrigger$(): Observable<boolean> {
    return this.layoutUpdateTrigger$.asObservable();
  }
}
