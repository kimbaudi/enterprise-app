import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '@core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css',
})
export class ToastComponent {
    @Input() toast!: Toast;
    @Output() dismiss = new EventEmitter<string>();

    isVisible = signal(true);

    getIcon(): string {
        switch (this.toast.type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return 'ℹ';
        }
    }

    onDismiss(): void {
        this.isVisible.set(false);
        setTimeout(() => {
            this.dismiss.emit(this.toast.id);
        }, 300);
    }
}
