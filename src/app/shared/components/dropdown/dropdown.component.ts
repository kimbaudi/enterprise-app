import {
    Component,
    Input,
    Output,
    EventEmitter,
    signal,
    HostListener,
    ElementRef,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dropdown',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
    private elementRef = inject(ElementRef);

    @Input() label = '';
    @Input() icon = '';
    @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'outline';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() position: 'left' | 'right' = 'left';
    @Input() disabled = false;

    @Output() itemClick = new EventEmitter<string>();

    isOpen = signal(false);

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    toggle(): void {
        if (this.disabled) return;
        this.isOpen.update((open) => !open);
    }

    close(): void {
        this.isOpen.set(false);
    }

    handleItemClick(id: string): void {
        this.itemClick.emit(id);
        this.close();
    }
}
