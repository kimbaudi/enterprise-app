import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface TransferListItem {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
}

export interface TransferChangeEvent {
  source: TransferListItem[];
  target: TransferListItem[];
  movedItems: TransferListItem[];
  direction: 'toTarget' | 'toSource';
}

@Component({
  selector: 'app-transfer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-list.component.html',
  styleUrl: './transfer-list.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TransferListComponent),
      multi: true,
    },
  ],
})
export class TransferListComponent implements ControlValueAccessor {
  @Input() items: TransferListItem[] = [];
  @Input() sourceTitle = 'Available';
  @Input() targetTitle = 'Selected';
  @Input() searchable = true;
  @Input() disabled = false;
  @Input() height = '400px';
  @Input() showCount = true;

  @Output() change = new EventEmitter<TransferChangeEvent>();
  @Output() sourceSelect = new EventEmitter<TransferListItem[]>();
  @Output() targetSelect = new EventEmitter<TransferListItem[]>();

  sourceItems = signal<TransferListItem[]>([]);
  targetItems = signal<TransferListItem[]>([]);
  sourceSelected = signal<Set<string>>(new Set());
  targetSelected = signal<Set<string>>(new Set());
  sourceSearch = signal('');
  targetSearch = signal('');

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  filteredSourceItems = computed(() => {
    const search = this.sourceSearch().toLowerCase();
    if (!search) return this.sourceItems();
    return this.sourceItems().filter((item) => item.label.toLowerCase().includes(search));
  });

  filteredTargetItems = computed(() => {
    const search = this.targetSearch().toLowerCase();
    if (!search) return this.targetItems();
    return this.targetItems().filter((item) => item.label.toLowerCase().includes(search));
  });

  sourceCount = computed(() => this.sourceItems().length);
  targetCount = computed(() => this.targetItems().length);

  canMoveToTarget = computed(() => {
    return this.sourceSelected().size > 0 && !this.disabled;
  });

  canMoveToSource = computed(() => {
    return this.targetSelected().size > 0 && !this.disabled;
  });

  canMoveAllToTarget = computed(() => {
    return this.sourceItems().some((item) => !item.disabled) && !this.disabled;
  });

  canMoveAllToSource = computed(() => {
    return this.targetItems().some((item) => !item.disabled) && !this.disabled;
  });

  ngOnInit(): void {
    // Initialize source items from input
    this.sourceItems.set([...this.items]);
  }

  writeValue(value: string[]): void {
    if (!value || !Array.isArray(value)) {
      this.targetItems.set([]);
      this.sourceItems.set([...this.items]);
      return;
    }

    const targetSet = new Set(value);
    const target: TransferListItem[] = [];
    const source: TransferListItem[] = [];

    this.items.forEach((item) => {
      if (targetSet.has(item.value)) {
        target.push(item);
      } else {
        source.push(item);
      }
    });

    this.targetItems.set(target);
    this.sourceItems.set(source);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleSourceItem(item: TransferListItem): void {
    if (item.disabled || this.disabled) return;

    const selected = new Set(this.sourceSelected());
    if (selected.has(item.value)) {
      selected.delete(item.value);
    } else {
      selected.add(item.value);
    }
    this.sourceSelected.set(selected);
    this.sourceSelect.emit(
      Array.from(selected)
        .map((v) => this.sourceItems().find((i) => i.value === v)!)
        .filter(Boolean),
    );
  }

  toggleTargetItem(item: TransferListItem): void {
    if (item.disabled || this.disabled) return;

    const selected = new Set(this.targetSelected());
    if (selected.has(item.value)) {
      selected.delete(item.value);
    } else {
      selected.add(item.value);
    }
    this.targetSelected.set(selected);
    this.targetSelect.emit(
      Array.from(selected)
        .map((v) => this.targetItems().find((i) => i.value === v)!)
        .filter(Boolean),
    );
  }

  moveToTarget(): void {
    if (!this.canMoveToTarget()) return;

    const selected = this.sourceSelected();
    const itemsToMove = this.sourceItems().filter((item) => selected.has(item.value));
    const newSource = this.sourceItems().filter((item) => !selected.has(item.value));
    const newTarget = [...this.targetItems(), ...itemsToMove];

    this.sourceItems.set(newSource);
    this.targetItems.set(newTarget);
    this.sourceSelected.set(new Set());

    this.emitChange(itemsToMove, 'toTarget');
  }

  moveToSource(): void {
    if (!this.canMoveToSource()) return;

    const selected = this.targetSelected();
    const itemsToMove = this.targetItems().filter((item) => selected.has(item.value));
    const newTarget = this.targetItems().filter((item) => !selected.has(item.value));
    const newSource = [...this.sourceItems(), ...itemsToMove];

    this.sourceItems.set(newSource);
    this.targetItems.set(newTarget);
    this.targetSelected.set(new Set());

    this.emitChange(itemsToMove, 'toSource');
  }

  moveAllToTarget(): void {
    if (!this.canMoveAllToTarget()) return;

    const itemsToMove = this.sourceItems().filter((item) => !item.disabled);
    const remainingSource = this.sourceItems().filter((item) => item.disabled);
    const newTarget = [...this.targetItems(), ...itemsToMove];

    this.sourceItems.set(remainingSource);
    this.targetItems.set(newTarget);
    this.sourceSelected.set(new Set());

    this.emitChange(itemsToMove, 'toTarget');
  }

  moveAllToSource(): void {
    if (!this.canMoveAllToSource()) return;

    const itemsToMove = this.targetItems().filter((item) => !item.disabled);
    const remainingTarget = this.targetItems().filter((item) => item.disabled);
    const newSource = [...this.sourceItems(), ...itemsToMove];

    this.sourceItems.set(newSource);
    this.targetItems.set(remainingTarget);
    this.targetSelected.set(new Set());

    this.emitChange(itemsToMove, 'toSource');
  }

  private emitChange(movedItems: TransferListItem[], direction: 'toTarget' | 'toSource'): void {
    const values = this.targetItems().map((item) => item.value);
    this.onChange(values);
    this.onTouched();

    this.change.emit({
      source: this.sourceItems(),
      target: this.targetItems(),
      movedItems,
      direction,
    });
  }

  isSourceItemSelected(item: TransferListItem): boolean {
    return this.sourceSelected().has(item.value);
  }

  isTargetItemSelected(item: TransferListItem): boolean {
    return this.targetSelected().has(item.value);
  }
}
