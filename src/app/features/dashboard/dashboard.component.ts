import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { TableComponent, TableColumn } from '@shared/components/table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, TableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Sample data for table demo
  columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, width: '120px' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '100px',
      format: (value) => (value ? 'Active' : 'Inactive'),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      width: '120px',
      format: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: true,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: true,
      createdAt: '2024-02-20',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Editor',
      status: false,
      createdAt: '2024-03-10',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice@example.com',
      role: 'User',
      status: true,
      createdAt: '2024-04-05',
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'Admin',
      status: true,
      createdAt: '2024-05-12',
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana@example.com',
      role: 'Editor',
      status: true,
      createdAt: '2024-06-18',
    },
    {
      id: 7,
      name: 'Edward Norton',
      email: 'edward@example.com',
      role: 'User',
      status: false,
      createdAt: '2024-07-22',
    },
    {
      id: 8,
      name: 'Fiona Apple',
      email: 'fiona@example.com',
      role: 'User',
      status: true,
      createdAt: '2024-08-30',
    },
  ];

  logout(): void {
    this.authService.logout();
  }

  onRowClick(user: any): void {
    console.log('Row clicked:', user);
  }
}
