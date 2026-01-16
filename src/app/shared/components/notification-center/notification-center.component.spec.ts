import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationCenterComponent } from './notification-center.component';

describe('NotificationCenterComponent', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCenterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCenterComponent);
    component = fixture.componentInstance;
    component.notifications = [
      {
        id: 1,
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test',
        timestamp: new Date(),
        read: false,
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate unread count', () => {
    expect(component.unreadCount()).toBe(1);
  });

  it('should filter notifications by type', () => {
    component.setFilter('info');
    expect(component.filteredNotifications().length).toBe(1);
  });

  it('should mark notification as read', () => {
    const notification = component.notifications[0];
    component.markAsRead(notification);
    expect(notification.read).toBe(true);
  });

  it('should format timestamp correctly', () => {
    const now = new Date();
    expect(component.formatTimestamp(now)).toBe('Just now');
  });

  it('should get notification icon by type', () => {
    expect(component.getNotificationIcon('info')).toBe('ℹ️');
    expect(component.getNotificationIcon('success')).toBe('✅');
  });
});
