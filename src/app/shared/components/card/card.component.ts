import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="card" [class.hoverable]="hoverable">
      <div class="card-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `,
    styles: [`
    .card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .card.hoverable {
      transition: box-shadow 0.2s;
      cursor: pointer;
    }

    .card.hoverable:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      padding: 1.25rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .card-body {
      padding: 1.25rem;
    }

    .card-footer {
      padding: 1.25rem;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }
  `],
})
export class CardComponent {
    @Input() title?: string;
    @Input() hoverable = false;
    @Input() hasFooter = false;
}
