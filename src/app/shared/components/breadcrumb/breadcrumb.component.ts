import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface BreadcrumbItem {
    label: string;
    url?: string;
    icon?: string;
    active?: boolean;
}

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {
    @Input() set items(value: BreadcrumbItem[]) {
        this.breadcrumbItems.set(value);
    }

    @Input() separator: '/' | '>' | '»' | '→' = '>';
    @Input() showHome = true;
    @Input() homeIcon = '🏠';
    @Input() homeUrl = '/';

    breadcrumbItems = signal<BreadcrumbItem[]>([]);

    navigate(item: BreadcrumbItem): void {
        if (item.active || !item.url) return;
        // Navigation is handled by routerLink in template
    }
}
