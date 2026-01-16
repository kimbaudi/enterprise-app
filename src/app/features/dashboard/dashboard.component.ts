import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import {
  TableComponent,
  TableColumn,
} from '@shared/components/table/table.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { InputComponent } from '@shared/components/input/input.component';
import { SelectComponent, SelectOption } from '@shared/components/select/select.component';
import { CheckboxComponent } from '@shared/components/checkbox/checkbox.component';
import { RadioComponent, RadioOption } from '@shared/components/radio/radio.component';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '@shared/components/breadcrumb/breadcrumb.component';
import { TabsComponent, Tab } from '@shared/components/tabs/tabs.component';
import { TabPanelComponent } from '@shared/components/tab-panel/tab-panel.component';
import { AccordionComponent } from '@shared/components/accordion/accordion.component';
import { AccordionItemComponent } from '@shared/components/accordion-item/accordion-item.component';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { DropdownItemComponent } from '@shared/components/dropdown-item/dropdown-item.component';
import { ToastService } from '@core/services/toast.service';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { ProgressComponent } from '@shared/components/progress/progress.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    TableComponent,
    ModalComponent,
    ThemeToggleComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    RadioComponent,
    BreadcrumbComponent,
    TabsComponent,
    TabPanelComponent,
    AccordionComponent,
    AccordionItemComponent,
    DropdownComponent,
    DropdownItemComponent,
    BadgeComponent,
    ProgressComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private toastService = inject(ToastService);

  showModal = false;
  selectedUser: any = null;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard', url: '/dashboard', icon: '📊' },
    { label: 'Overview', active: true },
  ];

  // Tabs demo data
  profileTabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '📈', badge: 12 },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'disabled', label: 'Disabled', icon: '🚫', disabled: true },
  ];

  activeProfileTab = signal('overview');

  // Form demo data
  formName = signal('');
  formEmail = signal('');
  formPassword = signal('');
  formCountry = signal<string | number | null>(null);
  formSkills = signal<(string | number)[]>([]);
  formNewsletter = signal(false);
  formNotifications = signal(false);
  formPlan = signal<string | number | null>(null);

  countryOptions: SelectOption[] = [
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Japan', value: 'jp' },
  ];

  skillOptions: SelectOption[] = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Node.js', value: 'node' },
    { label: 'Python', value: 'python' },
  ];

  planOptions: RadioOption[] = [
    { label: 'Free', value: 'free', hint: '$0/month - Basic features' },
    { label: 'Pro', value: 'pro', hint: '$29/month - Advanced features' },
    { label: 'Enterprise', value: 'enterprise', hint: '$99/month - All features' },
  ];

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
    this.selectedUser = user;
    this.showModal = true;
  }

  openModalViaService(): void {
    const modal = this.modalService.open({
      title: 'Service Modal',
      size: 'md',
      closeOnBackdrop: true,
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedUser = null;
  }

  deleteUser(): void {
    console.log('Delete user:', this.selectedUser);
    this.closeModal();
  }

  submitForm(): void {
    console.log('Form submitted:', {
      name: this.formName(),
      email: this.formEmail(),
      password: this.formPassword(),
      country: this.formCountry(),
      skills: this.formSkills(),
      newsletter: this.formNewsletter(),
      notifications: this.formNotifications(),
      plan: this.formPlan(),
    });
  }

  resetForm(): void {
    this.formName.set('');
    this.formEmail.set('');
    this.formPassword.set('');
    this.formCountry.set(null);
    this.formSkills.set([]);
    this.formNewsletter.set(false);
    this.formNotifications.set(false);
    this.formPlan.set(null);
  }

  onDropdownAction(action: string): void {
    console.log('Dropdown action:', action);
    switch (action) {
      case 'edit':
        alert('Edit action clicked');
        break;
      case 'duplicate':
        alert('Duplicate action clicked');
        break;
      case 'archive':
        alert('Archive action clicked');
        break;
      case 'delete':
        alert('Delete action clicked');
        break;
    }
  }

  showSuccessToast(): void {
    this.toastService.success('Operation completed successfully!', 'Success');
  }

  showErrorToast(): void {
    this.toastService.error(
      'Something went wrong. Please try again.',
      'Error',
      7000
    );
  }

  showWarningToast(): void {
    this.toastService.warning(
      'This action requires your attention.',
      'Warning'
    );
  }

  showInfoToast(): void {
    this.toastService.info('New updates are available.', 'Information', 6000);
  }
}
