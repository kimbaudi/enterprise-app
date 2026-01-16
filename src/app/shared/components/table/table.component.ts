import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T = any> {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    format?: (value: any, row: T) => string;
    template?: 'text' | 'badge' | 'actions' | 'custom';
}

export interface TableConfig {
    pageSize?: number;
    pageSizeOptions?: number[];
    showPagination?: boolean;
    showSearch?: boolean;
    stickyHeader?: boolean;
    striped?: boolean;
    hoverable?: boolean;
    bordered?: boolean;
}

export interface SortState {
    column: string;
    direction: 'asc' | 'desc' | null;
}

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
})
export class TableComponent<T = any> {
    @Input() columns: TableColumn<T>[] = [];
    @Input() data: T[] = [];
    @Input() config: TableConfig = {
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 50, 100],
        showPagination: true,
        showSearch: true,
        stickyHeader: false,
        striped: true,
        hoverable: true,
        bordered: false,
    };
    @Input() loading = false;
    @Input() emptyMessage = 'No data available';

    @Output() rowClick = new EventEmitter<T>();
    @Output() sortChange = new EventEmitter<SortState>();

    searchQuery = signal('');
    currentPage = signal(1);
    pageSize = signal(10);
    sortState = signal<SortState>({ column: '', direction: null });

    filteredData = computed(() => {
        let result = [...this.data];
        const query = this.searchQuery().toLowerCase();

        if (query) {
            result = result.filter((row) =>
                this.columns.some((col) => {
                    const value = this.getCellValue(row, col.key);
                    return String(value).toLowerCase().includes(query);
                })
            );
        }

        const sort = this.sortState();
        if (sort.column && sort.direction) {
            result.sort((a, b) => {
                const aVal = this.getCellValue(a, sort.column);
                const bVal = this.getCellValue(b, sort.column);

                if (aVal === bVal) return 0;
                const comparison = aVal > bVal ? 1 : -1;
                return sort.direction === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    });

    paginatedData = computed(() => {
        if (!this.config.showPagination) {
            return this.filteredData();
        }

        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        return this.filteredData().slice(start, end);
    });

    totalPages = computed(() => {
        return Math.ceil(this.filteredData().length / this.pageSize());
    });

    totalRecords = computed(() => this.filteredData().length);

    startRecord = computed(() => {
        return (this.currentPage() - 1) * this.pageSize() + 1;
    });

    endRecord = computed(() => {
        return Math.min(this.currentPage() * this.pageSize(), this.totalRecords());
    });

    ngOnInit(): void {
        this.pageSize.set(this.config.pageSize || 10);
    }

    onSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value);
        this.currentPage.set(1);
    }

    onSort(column: TableColumn): void {
        if (!column.sortable) return;

        const current = this.sortState();
        let newDirection: 'asc' | 'desc' | null = 'asc';

        if (current.column === column.key) {
            if (current.direction === 'asc') newDirection = 'desc';
            else if (current.direction === 'desc') newDirection = null;
        }

        const newState = {
            column: newDirection ? column.key : '',
            direction: newDirection,
        };

        this.sortState.set(newState);
        this.sortChange.emit(newState);
    }

    onPageChange(page: number): void {
        if (page < 1 || page > this.totalPages()) return;
        this.currentPage.set(page);
    }

    onPageSizeChange(event: Event): void {
        const value = parseInt((event.target as HTMLSelectElement).value);
        this.pageSize.set(value);
        this.currentPage.set(1);
    }

    onRowClick(row: T): void {
        this.rowClick.emit(row);
    }

    getCellValue(row: any, key: string): any {
        return key.split('.').reduce((obj, k) => obj?.[k], row);
    }

    formatCellValue(row: T, column: TableColumn<T>): string {
        const value = this.getCellValue(row, column.key);
        if (column.format) {
            return column.format(value, row);
        }
        return value ?? '';
    }

    getSortIcon(column: TableColumn): string {
        if (!column.sortable) return '';
        const current = this.sortState();
        if (current.column !== column.key) return '⇅';
        return current.direction === 'asc' ? '↑' : '↓';
    }

    getPages(): number[] {
        const total = this.totalPages();
        const current = this.currentPage();
        const delta = 2;
        const range: number[] = [];
        const rangeWithDots: number[] = [];

        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            rangeWithDots.push(1, -1);
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (current + delta < total - 1) {
            rangeWithDots.push(-1, total);
        } else if (total > 1) {
            rangeWithDots.push(total);
        }

        return rangeWithDots;
    }
}
