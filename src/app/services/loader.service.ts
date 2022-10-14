import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  showLoaderTime = 1000;
  isLoading = new BehaviorSubject<boolean>(false);

  constructor() { }

  show() {
    this.isLoading.next(true);
  }

  hide() {
    this.isLoading.next(false);
  }
}
