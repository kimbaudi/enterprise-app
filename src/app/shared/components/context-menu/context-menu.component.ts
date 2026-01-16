import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ContextMenuItem {
  label?: string;
  icon?: string;
  action?: string;
  disabled?: boolean;
  divider?: boolean;
  shortcut?: string;
  items?: ContextMenuItem[];
  [key: string]: any;
}

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css',
})
export class ContextMenuComponent {
  @Input() items: ContextMenuItem[] = [];
  @Input() triggerOn: 'contextmenu' | 'click' = 'contextmenu';

  @Output() itemClick = new EventEmitter<ContextMenuItem>();
  @Output() menuOpen = new EventEmitter<void>();
  @Output() menuClose = new EventEmitter<void>();

  @ViewChild('menu') menuElement?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  position = signal({ x: 0, y: 0 });
  openSubmenuIndex = signal<number | null>(null);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && this.menuElement) {
      const target = event.target as HTMLElement;
      if (!this.menuElement.nativeElement.contains(target)) {
        this.close();
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  open(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const x = event.clientX;
    const y = event.clientY;

    this.position.set({ x, y });
    this.isOpen.set(true);
    this.openSubmenuIndex.set(null);
    this.menuOpen.emit();

    // Adjust position if menu goes off screen
    setTimeout(() => {
      this.adjustPosition();
    });
  }

  close(): void {
    this.isOpen.set(false);
    this.openSubmenuIndex.set(null);
    this.menuClose.emit();
  }

  onItemClick(event: MouseEvent, item: ContextMenuItem, index: number): void {
    event.stopPropagation();

    if (item.disabled || item.divider) {
      return;
    }

    if (item.items && item.items.length > 0) {
      // Toggle submenu
      if (this.openSubmenuIndex() === index) {
        this.openSubmenuIndex.set(null);
      } else {
        this.openSubmenuIndex.set(index);
      }
    } else {
      // Execute action
      this.itemClick.emit(item);
      this.close();
    }
  }

  onSubmenuItemClick(event: MouseEvent, item: ContextMenuItem): void {
    event.stopPropagation();

    if (item.disabled || item.divider) {
      return;
    }

    this.itemClick.emit(item);
    this.close();
  }

  isSubmenuOpen(index: number): boolean {
    return this.openSubmenuIndex() === index;
  }

  private adjustPosition(): void {
    if (!this.menuElement) return;

    const menu = this.menuElement.nativeElement;
    const rect = menu.getBoundingClientRect();
    const { x, y } = this.position();

    let newX = x;
    let newY = y;

    // Check if menu goes off right edge
    if (x + rect.width > window.innerWidth) {
      newX = window.innerWidth - rect.width - 10;
    }

    // Check if menu goes off bottom edge
    if (y + rect.height > window.innerHeight) {
      newY = window.innerHeight - rect.height - 10;
    }

    // Check if menu goes off left edge
    if (newX < 0) {
      newX = 10;
    }

    // Check if menu goes off top edge
    if (newY < 0) {
      newY = 10;
    }

    if (newX !== x || newY !== y) {
      this.position.set({ x: newX, y: newY });
    }
  }
}
