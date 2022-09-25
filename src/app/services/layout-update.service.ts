import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutUpdateService {

  private layoutUpdateTrigger$: Subject<boolean> = new Subject;

  constructor() { }

  setLayoutUpdate$(updateState: boolean) {
    this.layoutUpdateTrigger$.next(updateState);
  }

  getLayoutUpdateTrigger$(): Observable<boolean> {
    return this.layoutUpdateTrigger$.asObservable();
  }
}
