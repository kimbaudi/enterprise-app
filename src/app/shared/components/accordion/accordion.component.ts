import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accordion" [class.accordion-flush]="flush">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .accordion {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .accordion-flush {
        gap: 0;
      }
    `,
  ],
})
export class AccordionComponent {
  @Input() allowMultiple = false;
  @Input() flush = false;

  private openItems = signal<Set<string>>(new Set());

  isOpen(id: string): boolean {
    return this.openItems().has(id);
  }

  toggle(id: string): void {
    const current = new Set(this.openItems());

    if (current.has(id)) {
      current.delete(id);
    } else {
      if (!this.allowMultiple) {
        current.clear();
      }
      current.add(id);
    }

    this.openItems.set(current);
  }
}
