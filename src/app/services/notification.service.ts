import { Injectable } from '@angular/core';
import {
  ToastNotificationInitializer,
  DialogLayoutDisplay,
  ToastUserViewTypeEnum,
  ToastProgressBarEnum,
  DisappearanceAnimation,
  AppearanceAnimation,
  ToastPositionEnum,
} from '@costlydeveloper/ngx-awesome-popup';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  toastNotification(message: string) {
    const newToastNotification = new ToastNotificationInitializer();

    newToastNotification.setMessage(message);

    // Choose layout color type
    newToastNotification.setConfig({
    autoCloseDelay: 3000, // optional
    textPosition: 'center', // optional
    layoutType: DialogLayoutDisplay.INFO, // SUCCESS | INFO | NONE | DANGER | WARNING
    progressBar: ToastProgressBarEnum.NONE, // INCREASE | DECREASE | NONE
    toastUserViewType: ToastUserViewTypeEnum.SIMPLE, // STANDARD | SIMPLE
    animationIn: AppearanceAnimation.FADE_IN, // BOUNCE_IN | SWING | ZOOM_IN | ZOOM_IN_ROTATE | ELASTIC | JELLO | FADE_IN | SLIDE_IN_UP | SLIDE_IN_DOWN | SLIDE_IN_LEFT | SLIDE_IN_RIGHT | NONE
    animationOut: DisappearanceAnimation.NONE, // BOUNCE_OUT | ZOOM_OUT | ZOOM_OUT_WIND | ZOOM_OUT_ROTATE | FLIP_OUT | SLIDE_OUT_UP | SLIDE_OUT_DOWN | SLIDE_OUT_LEFT | SLIDE_OUT_RIGHT | NONE
     // TOP_LEFT | TOP_CENTER | TOP_RIGHT | TOP_FULL_WIDTH | BOTTOM_LEFT | BOTTOM_CENTER | BOTTOM_RIGHT | BOTTOM_FULL_WIDTH
    toastPosition: ToastPositionEnum.BOTTOM_CENTER,
    });

    // Simply open the popup
    newToastNotification.openToastNotification$();
  }
}
