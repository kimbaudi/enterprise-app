import {
    Component,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerStyle = 'solid' | 'dashed' | 'dotted';
export type DividerColor = 'default' | 'light' | 'dark' | 'primary' | 'success' | 'error' | 'warning' | 'info';
export type DividerThickness = 'thin' | 'medium' | 'thick';
export type DividerTextAlign = 'left' | 'center' | 'right';

@Component({
    selector: 'app-divider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './divider.component.html',
    styleUrl: './divider.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerComponent {
    @Input() orientation: DividerOrientation = 'horizontal';
    @Input() style: DividerStyle = 'solid';
    @Input() color: DividerColor = 'default';
    @Input() thickness: DividerThickness = 'thin';
    @Input() text?: string;
    @Input() textAlign: DividerTextAlign = 'center';
    @Input() spacing: 'none' | 'sm' | 'md' | 'lg' = 'md';

    get dividerClasses(): string {
        const classes = [
            'divider',
            `divider-${this.orientation}`,
            `divider-${this.style}`,
            `divider-${this.color}`,
            `divider-${this.thickness}`,
            `divider-spacing-${this.spacing}`,
        ];

        if (this.text) {
            classes.push('divider-with-text');
            classes.push(`divider-text-${this.textAlign}`);
        }

        return classes.join(' ');
    }
}
