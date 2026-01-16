import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'solid' | 'outline' | 'subtle';
export type ChipColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'gray';
export type ChipSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-chip',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chip.component.html',
    styleUrl: './chip.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
    @Input() label = '';
    @Input() variant: ChipVariant = 'solid';
    @Input() color: ChipColor = 'primary';
    @Input() size: ChipSize = 'md';
    @Input() icon?: string;
    @Input() avatar?: string;
    @Input() removable = false;
    @Input() clickable = false;
    @Input() disabled = false;
    @Input() selected = false;

    @Output() remove = new EventEmitter<void>();
    @Output() chipClick = new EventEmitter<void>();

    onRemove(event: Event): void {
        event.stopPropagation();
        if (!this.disabled) {
            this.remove.emit();
        }
    }

    onClick(): void {
        if (!this.disabled && this.clickable) {
            this.chipClick.emit();
        }
    }

    get chipClasses(): string {
        const classes = [
            'chip',
            `chip-${this.variant}`,
            `chip-${this.color}`,
            `chip-${this.size}`,
        ];

        if (this.clickable && !this.disabled) {
            classes.push('chip-clickable');
        }

        if (this.disabled) {
            classes.push('chip-disabled');
        }

        if (this.selected) {
            classes.push('chip-selected');
        }

        return classes.join(' ');
    }
}
