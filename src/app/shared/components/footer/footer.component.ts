import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Footer component for application layout
 */
@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-section">
                    <p class="copyright">{{ copyright }}</p>
                </div>
                
                <div class="footer-section">
                    <ng-content select="[links]"></ng-content>
                </div>
                
                <div class="footer-section">
                    <ng-content select="[social]"></ng-content>
                </div>
            </div>
        </footer>
    `,
    styles: [`
        .footer {
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            margin-top: auto;
        }

        .footer-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.5rem;
            max-width: 1920px;
            margin: 0 auto;
            gap: 2rem;
        }

        .footer-section {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .copyright {
            color: #6b7280;
            font-size: 0.875rem;
            margin: 0;
        }

        @media (max-width: 768px) {
            .footer-content {
                flex-direction: column;
                align-items: flex-start;
                gap: 1rem;
            }
        }
    `]
})
export class FooterComponent {
    @Input() copyright = `© ${new Date().getFullYear()} Enterprise App. All rights reserved.`;
}
