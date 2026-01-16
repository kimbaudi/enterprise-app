import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbTrailItem {
  label: string;
  url?: string;
  icon?: string;
  disabled?: boolean;
  items?: BreadcrumbTrailItem[];
  [key: string]: any;
}

@Component({
  selector: 'app-breadcrumb-trail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breadcrumb-trail.component.html',
  styleUrl: './breadcrumb-trail.component.css',
})
export class BreadcrumbTrailComponent {
  @Input() items: BreadcrumbTrailItem[] = [];
  @Input() separator: 'slash' | 'chevron' | 'arrow' | 'dot' = 'chevron';
  @Input() showHome = true;
  @Input() homeIcon = '🏠';
  @Input() homeLabel = 'Home';
  @Input() homeUrl = '/';
  @Input() maxItems = 0; // 0 means no limit
  @Input() collapsedLabel = '...';

  @Output() itemClick = new EventEmitter<BreadcrumbTrailItem>();
  @Output() homeClick = new EventEmitter<void>();

  openDropdownIndex: number | null = null;

  get visibleItems(): BreadcrumbTrailItem[] {
    if (this.maxItems === 0 || this.items.length <= this.maxItems) {
      return this.items;
    }

    const keepFirst = 1;
    const keepLast = this.maxItems - keepFirst - 1;
    const first = this.items.slice(0, keepFirst);
    const last = this.items.slice(-keepLast);
    const collapsed = this.items.slice(keepFirst, -keepLast);

    return [...first, { label: this.collapsedLabel, items: collapsed }, ...last];
  }

  get separatorSymbol(): string {
    switch (this.separator) {
      case 'slash':
        return '/';
      case 'chevron':
        return '›';
      case 'arrow':
        return '→';
      case 'dot':
        return '•';
      default:
        return '›';
    }
  }

  onHomeClick(event: Event): void {
    event.preventDefault();
    this.homeClick.emit();
  }

  onItemClick(event: Event, item: BreadcrumbTrailItem, index: number): void {
    event.preventDefault();

    if (item.disabled) {
      return;
    }

    if (item.items && item.items.length > 0) {
      this.toggleDropdown(index);
    } else {
      this.itemClick.emit(item);
    }
  }

  onDropdownItemClick(event: Event, item: BreadcrumbTrailItem): void {
    event.preventDefault();
    event.stopPropagation();

    if (!item.disabled) {
      this.itemClick.emit(item);
      this.closeDropdown();
    }
  }

  toggleDropdown(index: number): void {
    if (this.openDropdownIndex === index) {
      this.closeDropdown();
    } else {
      this.openDropdownIndex = index;
    }
  }

  closeDropdown(): void {
    this.openDropdownIndex = null;
  }

  isLastItem(index: number): boolean {
    return index === this.visibleItems.length - 1;
  }
}
