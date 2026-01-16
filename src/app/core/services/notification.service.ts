import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Notification, NotificationType, NotificationTypes } from '@core/models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$: Observable<Notification> = this.notificationSubject.asObservable();

  showSuccess(message: string, duration = 3000): void {
    this.show(NotificationTypes.Success, message, duration);
  }

  showError(message: string, duration = 5000): void {
    this.show(NotificationTypes.Error, message, duration);
  }

  showWarning(message: string, duration = 4000): void {
    this.show(NotificationTypes.Warning, message, duration);
  }

  showInfo(message: string, duration = 3000): void {
    this.show(NotificationTypes.Info, message, duration);
  }

  private show(type: NotificationType, message: string, duration: number): void {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      duration,
      timestamp: new Date(),
    };
    this.notificationSubject.next(notification);
  }
}
