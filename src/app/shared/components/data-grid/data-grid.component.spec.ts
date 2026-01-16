import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataGridComponent } from './data-grid.component';

describe('DataGridComponent', () => {
  let component: DataGridComponent;
  let fixture: ComponentFixture<DataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data based on search query', () => {
    component.data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];
    component.columns = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
    ];

    component.onSearch('John');
    expect(component.filteredData().length).toBe(1);
    expect(component.filteredData()[0].name).toBe('John');
  });

  it('should sort data correctly', () => {
    component.data = [
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice' },
      { id: 3, name: 'Charlie' },
    ];
    component.columns = [
      { field: 'id', header: 'ID', sortable: true },
      { field: 'name', header: 'Name', sortable: true },
    ];

    component.onSort('name');
    const sorted = component.filteredData();
    expect(sorted[0].name).toBe('Alice');
    expect(sorted[2].name).toBe('Charlie');
  });

  it('should handle row selection', () => {
    const row = { id: 1, name: 'Test' };
    component.config = { selectable: true };
    component.data = [row];

    const event = new Event('click');
    component.onRowSelect(row, event);

    expect(component.selectedRows().has(row)).toBeTruthy();
  });

  it('should paginate data correctly', () => {
    component.data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
    component.config = { pagination: true, pageSize: 10 };
    component.columns = [{ field: 'id', header: 'ID' }];

    expect(component.paginatedData().length).toBe(10);
    expect(component.totalPages()).toBe(3);

    component.onPageChange(2);
    expect(component.currentPage()).toBe(2);
  });
});
