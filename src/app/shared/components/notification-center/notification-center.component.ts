import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
// import { ButtonComponent } from '../button/button.component';
import { AvatarComponent } from '../avatar/avatar.component';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'mention';

export interface Notification {
  id: string | number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

export interface NotificationCenterConfig {
  maxHeight?: string;
  showFilters?: boolean;
  showMarkAllRead?: boolean;
  showClearAll?: boolean;
  groupByDate?: boolean;
  enableActions?: boolean;
}

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, BadgeComponent /*, ButtonComponent*/, AvatarComponent],
  templateUrl: './notification-center.component.html',
  styleUrl: './notification-center.component.css',
})
export class NotificationCenterComponent {
  @Input() notifications: Notification[] = [];
  @Input() config: NotificationCenterConfig = {
    maxHeight: '500px',
    showFilters: true,
    showMarkAllRead: true,
    showClearAll: false,
    groupByDate: true,
    enableActions: true,
  };

  @Output() notificationClick = new EventEmitter<Notification>();
  @Output() notificationRead = new EventEmitter<Notification>();
  @Output() notificationDelete = new EventEmitter<Notification>();
  @Output() notificationAction = new EventEmitter<Notification>();
  @Output() markAllAsRead = new EventEmitter<void>();
  @Output() clearAll = new EventEmitter<void>();

  selectedFilter = signal<NotificationType | 'all'>('all');

  // Computed values
  unreadCount = computed(() => {
    return this.notifications.filter((n) => !n.read).length;
  });

  filteredNotifications = computed(() => {
    const filter = this.selectedFilter();
    if (filter === 'all') {
      return this.notifications;
    }
    return this.notifications.filter((n) => n.type === filter);
  });

  groupedNotifications = computed(() => {
    if (!this.config.groupByDate) {
      return { '': this.filteredNotifications() };
    }

    const groups: Record<string, Notification[]> = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    this.filteredNotifications().forEach((notification) => {
      const notifDate = new Date(notification.timestamp);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      let groupKey: string;
      if (notifDay.getTime() === today.getTime()) {
        groupKey = 'Today';
      } else if (notifDay.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday';
      } else if (now.getTime() - notifDay.getTime() < 7 * 24 * 60 * 60 * 1000) {
        groupKey = 'This Week';
      } else {
        groupKey = 'Older';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notification);
    });

    return groups;
  });

  filterOptions = [
    { label: 'All', value: 'all' as const },
    { label: 'Info', value: 'info' as const },
    { label: 'Success', value: 'success' as const },
    { label: 'Warning', value: 'warning' as const },
    { label: 'Error', value: 'error' as const },
    { label: 'Mentions', value: 'mention' as const },
  ];

  setFilter(filter: NotificationType | 'all') {
    this.selectedFilter.set(filter);
  }

  onNotificationClick(notification: Notification) {
    this.notificationClick.emit(notification);
    if (!notification.read) {
      this.markAsRead(notification);
    }
  }

  markAsRead(notification: Notification) {
    notification.read = true;
    this.notificationRead.emit(notification);
  }

  markAsUnread(notification: Notification, event: Event) {
    event.stopPropagation();
    notification.read = false;
    this.notificationRead.emit(notification);
  }

  deleteNotification(notification: Notification, event: Event) {
    event.stopPropagation();
    this.notificationDelete.emit(notification);
  }

  onMarkAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.markAllAsRead.emit();
  }

  onClearAll() {
    this.clearAll.emit();
  }

  onNotificationAction(notification: Notification, event: Event) {
    event.stopPropagation();
    this.notificationAction.emit(notification);
  }

  getNotificationIcon(type: NotificationType): string {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      mention: '@',
    };
    return icons[type];
  }

  getNotificationBadgeVariant(type: NotificationType): 'outline' | 'solid' | 'subtle' {
    return type === 'error' || type === 'warning' ? 'solid' : 'outline';
  }

  formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString();
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
