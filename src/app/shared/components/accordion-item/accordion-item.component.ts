import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from '../accordion/accordion.component';

@Component({
    selector: 'app-accordion-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './accordion-item.component.html',
    styleUrl: './accordion-item.component.css',
})
export class AccordionItemComponent {
    private accordion = inject(AccordionComponent, { optional: true });

    @Input() id = '';
    @Input() title = '';
    @Input() icon = '';
    @Input() disabled = false;

    isOpen = signal(false);

    ngOnInit(): void {
        if (this.accordion) {
            // Check if this item should be open
            this.isOpen.set(this.accordion.isOpen(this.id));
        }
    }

    toggle(): void {
        if (this.disabled) return;

        if (this.accordion) {
            this.accordion.toggle(this.id);
            this.isOpen.set(this.accordion.isOpen(this.id));
        } else {
            this.isOpen.update((open) => !open);
        }
    }
}
