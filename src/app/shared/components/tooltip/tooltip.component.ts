import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css',
})
export class TooltipComponent {
  @Input() content = '';
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Input() visible = false;
}
