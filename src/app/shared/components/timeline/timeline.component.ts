import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TimelineOrientation = 'vertical' | 'horizontal';
export type TimelinePosition = 'left' | 'right' | 'alternate';
export type TimelineItemStatus = 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary';

export interface TimelineItem {
  title: string;
  description?: string;
  timestamp?: string;
  icon?: string;
  status?: TimelineItemStatus;
  content?: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  @Input() set items(value: TimelineItem[]) {
    this._items.set(value);
  }
  get items(): TimelineItem[] {
    return this._items();
  }

  @Input() orientation: TimelineOrientation = 'vertical';
  @Input() position: TimelinePosition = 'left';
  @Input() showLine = true;

  private _items = signal<TimelineItem[]>([]);

  get containerClasses(): string {
    const classes = [
      'timeline',
      `timeline-${this.orientation}`,
      `timeline-position-${this.position}`,
    ];

    if (!this.showLine) {
      classes.push('timeline-no-line');
    }

    return classes.join(' ');
  }

  getItemClasses(index: number): string {
    const item = this._items()[index];
    const classes = ['timeline-item'];

    if (item.status) {
      classes.push(`timeline-item-${item.status}`);
    }

    if (this.position === 'alternate') {
      classes.push(index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right');
    } else {
      classes.push(`timeline-item-${this.position}`);
    }

    return classes.join(' ');
  }

  getDefaultIcon(item: TimelineItem): string {
    if (item.icon) {
      return item.icon;
    }

    switch (item.status) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'primary':
        return '●';
      default:
        return '●';
    }
  }
}
