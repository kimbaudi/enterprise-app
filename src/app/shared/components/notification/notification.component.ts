import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@core/services/notification.service';
import { NotificationTypes, NotificationType, Notification } from '@core/models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  notifications = signal<Notification[]>([]);

  constructor() {
    effect((onCleanup) => {
      const subscription = this.notificationService.notification$.subscribe((notification) => {
        this.add(notification);
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  add(notification: Notification): void {
    this.notifications.update((notifs) => [...notifs, notification]);

    if (notification.duration) {
      setTimeout(() => {
        this.remove(notification);
      }, notification.duration);
    }
  }

  remove(notification: Notification): void {
    this.notifications.update((notifs) => notifs.filter((n) => n !== notification));
  }

  getIcon(type: NotificationType): string {
    switch (type) {
      case NotificationTypes.Success:
        return '✓';
      case NotificationTypes.Error:
        return '✗';
      case NotificationTypes.Warning:
        return '⚠';
      case NotificationTypes.Info:
        return 'ℹ';
      default:
        return '';
    }
  }
}
