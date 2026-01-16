import { Component, Input, Output, EventEmitter, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  @Input() set totalItems(value: number) {
    this._totalItems.set(value);
  }
  @Input() set pageSize(value: number) {
    this._pageSize.set(value);
  }
  @Input() set currentPage(value: number) {
    this._currentPage.set(value);
  }
  @Input() maxPages = 7;
  @Input() showFirstLast = true;
  @Input() showPrevNext = true;
  @Input() showPageInfo = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() pageChange = new EventEmitter<number>();

  private _totalItems = signal(0);
  private _pageSize = signal(10);
  private _currentPage = signal(1);

  totalPages = computed(() => Math.ceil(this._totalItems() / this._pageSize()) || 1);

  pages = computed(() => {
    const total = this.totalPages();
    const current = this._currentPage();
    const max = this.maxPages;
    const pages: (number | string)[] = [];

    if (total <= max) {
      // Show all pages
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Show subset with ellipsis
      const half = Math.floor(max / 2);
      let start = Math.max(1, current - half);
      let end = Math.min(total, current + half);

      // Adjust if we're at the beginning or end
      if (current <= half) {
        end = max - 1;
      } else if (current >= total - half) {
        start = total - max + 2;
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < total) {
        if (end < total - 1) pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });

  pageInfo = computed(() => {
    const total = this._totalItems();
    const pageSize = this._pageSize();
    const current = this._currentPage();
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);
    return `${start}-${end} of ${total}`;
  });

  get isFirstPage(): boolean {
    return this._currentPage() === 1;
  }

  get isLastPage(): boolean {
    return this._currentPage() === this.totalPages();
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    if (page < 1 || page > this.totalPages()) return;
    if (page === this._currentPage()) return;

    this._currentPage.set(page);
    this.pageChange.emit(page);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages());
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage) {
      this.goToPage(this._currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage) {
      this.goToPage(this._currentPage() + 1);
    }
  }

  isCurrentPage(page: number | string): boolean {
    return typeof page === 'number' && page === this._currentPage();
  }
}
