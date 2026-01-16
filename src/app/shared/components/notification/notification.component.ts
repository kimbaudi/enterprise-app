import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@core/services/notification.service';
import { NotificationTypes, NotificationType, Notification } from '@core/models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications()"
        class="notification"
        [class]="'notification-' + notification.type"
      >
        <div class="notification-content">
          <span class="notification-icon">{{ getIcon(notification.type) }}</span>
          <span class="notification-message">{{ notification.message }}</span>
        </div>
        <button class="notification-close" (click)="remove(notification)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 24rem;
    }

    .notification {
      padding: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .notification-icon {
      font-size: 1.25rem;
    }

    .notification-message {
      font-size: 0.875rem;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .notification-close:hover {
      opacity: 1;
    }

    .notification-success {
      background-color: #10b981;
      color: white;
    }

    .notification-error {
      background-color: #ef4444;
      color: white;
    }

    .notification-warning {
      background-color: #f59e0b;
      color: white;
    }

    .notification-info {
      background-color: #3b82f6;
      color: white;
    }
  `],
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
    this.notifications.update(notifs => [...notifs, notification]);

    if (notification.duration) {
      setTimeout(() => {
        this.remove(notification);
      }, notification.duration);
    }
  }

  remove(notification: Notification): void {
    this.notifications.update(notifs => notifs.filter(n => n !== notification));
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
