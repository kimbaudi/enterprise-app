import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-badge',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './badge.component.html',
    styleUrl: './badge.component.css',
})
export class BadgeComponent {
    @Input() variant: 'solid' | 'outline' | 'subtle' = 'solid';
    @Input() color:
        | 'primary'
        | 'success'
        | 'error'
        | 'warning'
        | 'info'
        | 'gray' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() rounded = false;
    @Input() dot = false;
    @Input() removable = false;
    @Input() icon = '';
}
