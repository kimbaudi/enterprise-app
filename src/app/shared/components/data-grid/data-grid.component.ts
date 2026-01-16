import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { PaginationComponent } from '../pagination/pagination.component';

export interface DataGridColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'custom';
  format?: (value: any) => string;
  cellTemplate?: any;
}

export interface DataGridConfig {
  selectable?: boolean;
  multiSelect?: boolean;
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  rowHeight?: 'compact' | 'normal' | 'comfortable';
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  field: string;
  direction: SortDirection;
}

@Component({
  selector: 'app-data-grid',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PaginationComponent],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.css',
})
export class DataGridComponent {
  @Input() columns: DataGridColumn[] = [];
  @Input() data: any[] = [];
  @Input() config: DataGridConfig = {
    selectable: false,
    multiSelect: false,
    pagination: true,
    pageSize: 10,
    sortable: true,
    filterable: true,
    exportable: false,
    rowHeight: 'normal',
  };
  @Input() loading = false;
  @Input() emptyMessage = 'No data available';

  @Output() rowClick = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<SortState>();
  @Output() filterChange = new EventEmitter<{ [key: string]: string }>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() export = new EventEmitter<void>();

  // State
  currentPage = signal(1);
  sortState = signal<SortState | null>(null);
  filters = signal<{ [key: string]: string }>({});
  selectedRows = signal<Set<any>>(new Set());
  searchQuery = signal('');

  // Computed values
  filteredData = computed(() => {
    let result = [...this.data];

    // Apply search
    const search = this.searchQuery().toLowerCase();
    if (search) {
      result = result.filter((row) =>
        this.columns.some((col) => {
          const value = row[col.field];
          return value?.toString().toLowerCase().includes(search);
        }),
      );
    }

    // Apply column filters
    const filterObj = this.filters();
    Object.keys(filterObj).forEach((field) => {
      const filterValue = filterObj[field].toLowerCase();
      if (filterValue) {
        result = result.filter((row) => row[field]?.toString().toLowerCase().includes(filterValue));
      }
    });

    // Apply sorting
    const sort = this.sortState();
    if (sort && sort.direction) {
      result.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];

        let comparison = 0;
        if (aVal < bVal) comparison = -1;
        if (aVal > bVal) comparison = 1;

        return sort.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  });

  paginatedData = computed(() => {
    if (!this.config.pagination) {
      return this.filteredData();
    }

    const start = (this.currentPage() - 1) * (this.config.pageSize || 10);
    const end = start + (this.config.pageSize || 10);
    return this.filteredData().slice(start, end);
  });

  totalPages = computed(() => {
    if (!this.config.pagination) return 1;
    return Math.ceil(this.filteredData().length / (this.config.pageSize || 10));
  });

  allSelected = computed(() => {
    if (!this.paginatedData().length) return false;
    return this.paginatedData().every((row) => this.selectedRows().has(row));
  });

  someSelected = computed(() => {
    if (!this.paginatedData().length) return false;
    const selected = this.selectedRows();
    return this.paginatedData().some((row) => selected.has(row)) && !this.allSelected();
  });

  // Methods
  onSort(field: string) {
    if (!this.config.sortable) return;

    const column = this.columns.find((col) => col.field === field);
    if (!column?.sortable) return;

    const current = this.sortState();
    let direction: SortDirection = 'asc';

    if (current?.field === field) {
      if (current.direction === 'asc') direction = 'desc';
      else if (current.direction === 'desc') direction = null;
    }

    const newState = direction ? { field, direction } : null;
    this.sortState.set(newState);

    if (newState) {
      this.sortChange.emit(newState);
    }
  }

  onFilter(field: string, value: string) {
    const currentFilters = { ...this.filters() };
    if (value) {
      currentFilters[field] = value;
    } else {
      delete currentFilters[field];
    }
    this.filters.set(currentFilters);
    this.filterChange.emit(currentFilters);
    this.currentPage.set(1); // Reset to first page
  }

  onSearch(value: string) {
    this.searchQuery.set(value);
    this.currentPage.set(1); // Reset to first page
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  onRowSelect(row: any, event: Event) {
    event.stopPropagation();
    const selected = new Set(this.selectedRows());

    if (this.config.multiSelect) {
      if (selected.has(row)) {
        selected.delete(row);
      } else {
        selected.add(row);
      }
    } else {
      selected.clear();
      selected.add(row);
    }

    this.selectedRows.set(selected);
    this.rowSelect.emit(Array.from(selected));
  }

  onSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set(this.selectedRows());

    if (checked) {
      this.paginatedData().forEach((row) => selected.add(row));
    } else {
      this.paginatedData().forEach((row) => selected.delete(row));
    }

    this.selectedRows.set(selected);
    this.rowSelect.emit(Array.from(selected));
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  onExport() {
    this.export.emit();
  }

  exportToCSV() {
    const data = this.filteredData();
    const headers = this.columns.map((col) => col.header).join(',');
    const rows = data.map((row) =>
      this.columns
        .map((col) => {
          const value = row[col.field];
          const formatted = col.format ? col.format(value) : value;
          return `"${formatted}"`;
        })
        .join(','),
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-export-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  getCellValue(row: any, column: DataGridColumn): string {
    const value = row[column.field];
    if (column.format) {
      return column.format(value);
    }
    return value ?? '';
  }

  getSortIcon(field: string): string {
    const sort = this.sortState();
    if (sort?.field !== field) return '⇅';
    return sort.direction === 'asc' ? '↑' : '↓';
  }

  clearFilters() {
    this.filters.set({});
    this.searchQuery.set('');
    this.filterChange.emit({});
  }

  clearSelection() {
    this.selectedRows.set(new Set());
    this.rowSelect.emit([]);
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.filters()).length > 0 || this.searchQuery().length > 0;
  }

  getStartIndex(): number {
    return (this.currentPage() - 1) * (this.config.pageSize || 10) + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage() * (this.config.pageSize || 10);
    return Math.min(end, this.filteredData().length);
  }
}
