import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tab-panel" [class.active]="active" role="tabpanel" [attr.aria-hidden]="!active">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .tab-panel {
        display: none;
        animation: fadeIn 0.2s ease-in;
      }

      .tab-panel.active {
        display: block;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class TabPanelComponent {
  @Input() tabId = '';
  @Input() active = false;
}
