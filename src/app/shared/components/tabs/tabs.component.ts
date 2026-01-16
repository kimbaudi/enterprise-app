import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent {
  @Input() tabs: Tab[] = [];
  @Input() variant: 'default' | 'pills' | 'underline' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;

  private _activeTabId = signal<string>('');

  @Input() set activeTabId(value: string) {
    this._activeTabId.set(value);
  }

  get activeTabId(): string {
    return this._activeTabId();
  }

  activeTab = computed(() => {
    const id = this._activeTabId();
    return this.tabs.find((tab) => tab.id === id) || this.tabs[0];
  });

  ngOnInit(): void {
    if (!this._activeTabId() && this.tabs.length > 0) {
      this._activeTabId.set(this.tabs[0].id);
    }
  }

  selectTab(tab: Tab): void {
    if (tab.disabled) return;
    this._activeTabId.set(tab.id);
  }

  isActive(tab: Tab): boolean {
    return this._activeTabId() === tab.id;
  }
}
