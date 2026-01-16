import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

@Component({
    selector: 'app-empty-state',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
    @Input() icon?: string;
    @Input() image?: string;
    @Input() title = 'No data available';
    @Input() description?: string;
    @Input() primaryActionLabel?: string;
    @Input() secondaryActionLabel?: string;
    @Input() size: EmptyStateSize = 'md';
    @Input() compact = false;

    @Output() primaryAction = new EventEmitter<void>();
    @Output() secondaryAction = new EventEmitter<void>();

    onPrimaryAction(): void {
        this.primaryAction.emit();
    }

    onSecondaryAction(): void {
        this.secondaryAction.emit();
    }

    get containerClasses(): string {
        const classes = [
            'empty-state',
            `empty-state-${this.size}`,
        ];

        if (this.compact) {
            classes.push('empty-state-compact');
        }

        return classes.join(' ');
    }
}
