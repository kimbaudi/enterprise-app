import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class SkeletonComponent {
  @Input() variant: 'pulse' | 'wave' | 'none' = 'pulse';
  @Input() shape: 'rectangle' | 'circle' | 'text' = 'rectangle';
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() rounded = false;
  @Input() count = 1;
}
