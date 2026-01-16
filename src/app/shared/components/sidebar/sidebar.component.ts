import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SidebarItem {
    label: string;
    icon?: string;
    route?: string;
    children?: SidebarItem[];
    badge?: string | number;
    active?: boolean;
}

/**
 * Sidebar component for application navigation
 */
@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <aside class="sidebar" [class.collapsed]="collapsed()">
            <div class="sidebar-header">
                <ng-content select="[header]"></ng-content>
            </div>
            
            <nav class="sidebar-nav">
                <ul class="nav-list">
                    <li *ngFor="let item of items" class="nav-item">
                        <a 
                            *ngIf="item.route && !item.children"
                            [routerLink]="item.route"
                            routerLinkActive="active"
                            class="nav-link"
                            (click)="onItemClick(item)"
                        >
                            <span class="nav-icon" *ngIf="item.icon">{{ item.icon }}</span>
                            <span class="nav-label" [class.hidden]="collapsed()">{{ item.label }}</span>
                            <span class="nav-badge" *ngIf="item.badge && !collapsed()">{{ item.badge }}</span>
                        </a>
                        
                        <button 
                            *ngIf="item.children"
                            class="nav-link"
                            [class.active]="item.active"
                            (click)="toggleItem(item)"
                        >
                            <span class="nav-icon" *ngIf="item.icon">{{ item.icon }}</span>
                            <span class="nav-label" [class.hidden]="collapsed()">{{ item.label }}</span>
                            <span class="nav-arrow" [class.hidden]="collapsed()">
                                {{ item.active ? '▼' : '▶' }}
                            </span>
                        </button>
                        
                        <ul *ngIf="item.children && item.active && !collapsed()" class="nav-submenu">
                            <li *ngFor="let child of item.children" class="nav-item">
                                <a 
                                    [routerLink]="child.route"
                                    routerLinkActive="active"
                                    class="nav-link"
                                    (click)="onItemClick(child)"
                                >
                                    <span class="nav-label">{{ child.label }}</span>
                                    <span class="nav-badge" *ngIf="child.badge">{{ child.badge }}</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
            
            <div class="sidebar-footer">
                <button class="collapse-btn" (click)="toggleCollapse()">
                    {{ collapsed() ? '→' : '←' }}
                </button>
            </div>
        </aside>
    `,
    styles: [`
        .sidebar {
            background: #1f2937;
            color: #fff;
            height: 100vh;
            width: 260px;
            display: flex;
            flex-direction: column;
            transition: width 0.3s ease;
            position: sticky;
            top: 0;
            overflow-y: auto;
        }

        .sidebar.collapsed {
            width: 70px;
        }

        .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-nav {
            flex: 1;
            padding: 1rem 0;
            overflow-y: auto;
        }

        .nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .nav-item {
            margin: 0.25rem 0;
        }

        .nav-link {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.5rem;
            color: #d1d5db;
            text-decoration: none;
            transition: all 0.2s;
            border: none;
            background: none;
            width: 100%;
            cursor: pointer;
            font-size: 0.875rem;
            gap: 0.75rem;
        }

        .nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
        }

        .nav-link.active {
            background: #667eea;
            color: #fff;
        }

        .nav-icon {
            font-size: 1.25rem;
            min-width: 24px;
        }

        .nav-label {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .nav-label.hidden {
            display: none;
        }

        .nav-badge {
            background: #ef4444;
            color: #fff;
            font-size: 0.75rem;
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-weight: 600;
        }

        .nav-arrow {
            font-size: 0.75rem;
        }

        .nav-submenu {
            list-style: none;
            padding: 0;
            margin: 0;
            background: rgba(0, 0, 0, 0.2);
        }

        .nav-submenu .nav-link {
            padding-left: 3.5rem;
        }

        .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .collapse-btn {
            width: 100%;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #fff;
            cursor: pointer;
            border-radius: 0.375rem;
            transition: background 0.2s;
        }

        .collapse-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
    `]
})
export class SidebarComponent {
    @Input() items: SidebarItem[] = [];
    @Input() initialCollapsed = false;
    @Output() itemClick = new EventEmitter<SidebarItem>();
    @Output() collapseChange = new EventEmitter<boolean>();

    collapsed = signal(false);

    ngOnInit(): void {
        this.collapsed.set(this.initialCollapsed);
    }

    toggleCollapse(): void {
        this.collapsed.update(value => !value);
        this.collapseChange.emit(this.collapsed());
    }

    toggleItem(item: SidebarItem): void {
        item.active = !item.active;
    }

    onItemClick(item: SidebarItem): void {
        this.itemClick.emit(item);
    }
}
