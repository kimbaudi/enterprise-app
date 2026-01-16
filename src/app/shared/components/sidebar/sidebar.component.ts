import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
}

/**
 * Sidebar component for application navigation
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() items: SidebarItem[] = [];
  @Input() initialCollapsed = false;
  @Output() itemClick = new EventEmitter<SidebarItem>();
  @Output() collapseChange = new EventEmitter<boolean>();

  collapsed = signal(false);

  ngOnInit(): void {
    this.collapsed.set(this.initialCollapsed);
  }

  toggleCollapse(): void {
    this.collapsed.update((value) => !value);
    this.collapseChange.emit(this.collapsed());
  }

  toggleItem(item: SidebarItem): void {
    item.active = !item.active;
  }

  onItemClick(item: SidebarItem): void {
    this.itemClick.emit(item);
  }
}
