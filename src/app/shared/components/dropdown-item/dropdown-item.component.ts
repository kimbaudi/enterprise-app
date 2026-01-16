import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
    selector: 'app-dropdown-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dropdown-item.component.html',
    styleUrl: './dropdown-item.component.css',
})
export class DropdownItemComponent {
    private dropdown = inject(DropdownComponent, { optional: true });

    @Input() id = '';
    @Input() icon = '';
    @Input() label = '';
    @Input() disabled = false;
    @Input() danger = false;
    @Input() divider = false;

    @Output() itemClick = new EventEmitter<string>();

    onClick(): void {
        if (this.disabled || this.divider) return;

        this.itemClick.emit(this.id);

        if (this.dropdown) {
            this.dropdown.handleItemClick(this.id);
        }
    }
}
