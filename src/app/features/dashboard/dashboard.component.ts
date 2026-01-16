import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';
import { TableComponent, TableColumn } from '@shared/components/table/table.component';
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
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ChipComponent } from '@shared/components/chip/chip.component';
import { DividerComponent } from '@shared/components/divider/divider.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { RatingComponent } from '@shared/components/rating/rating.component';
import { StepperComponent, Step } from '@shared/components/stepper/stepper.component';
import { TimelineComponent, TimelineItem } from '@shared/components/timeline/timeline.component';
import {
  DatePickerComponent,
  DateRange,
} from '@shared/components/date-picker/date-picker.component';
import {
  ColorPickerComponent,
  ColorFormat,
} from '@shared/components/color-picker/color-picker.component';
import { TreeViewComponent, TreeNode } from '@shared/components/tree-view/tree-view.component';

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
    SkeletonComponent,
    TooltipDirective,
    PaginationComponent,
    AlertComponent,
    AvatarComponent,
    ChipComponent,
    DividerComponent,
    EmptyStateComponent,
    FileUploadComponent,
    RatingComponent,
    StepperComponent,
    TimelineComponent,
    DatePickerComponent,
    ColorPickerComponent,
    TreeViewComponent,
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

  // Pagination demo data
  paginationCurrentPage = signal(1);
  paginationTotalItems = 250;
  paginationPageSize = 10;

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
    this.toastService.error('Something went wrong. Please try again.', 'Error', 7000);
  }

  showWarningToast(): void {
    this.toastService.warning('This action requires your attention.', 'Warning');
  }

  showInfoToast(): void {
    this.toastService.info('New updates are available.', 'Information', 6000);
  }

  onPaginationPageChange(page: number): void {
    this.paginationCurrentPage.set(page);
    console.log('Page changed to:', page);
  }

  // Rating demo data
  userRating = signal(0);
  halfStarRating = signal(3.5);
  productRating = signal(0);
  foodRating = signal(0);
  serviceRating = signal(0);
  atmosphereRating = signal(0);
  valueRating = signal(0);

  overallRating = computed(() => {
    const ratings = [
      this.foodRating(),
      this.serviceRating(),
      this.atmosphereRating(),
      this.valueRating(),
    ];
    const sum = ratings.reduce((acc, val) => acc + val, 0);
    const count = ratings.filter((r) => r > 0).length;
    return count > 0 ? Math.round((sum / count) * 2) / 2 : 0;
  });

  // Stepper demo data
  basicSteps: Step[] = [
    { label: 'Select campaign' },
    { label: 'Create an ad group' },
    { label: 'Create an ad' },
  ];

  stepsWithDescription: Step[] = [
    { label: 'Step 1', description: 'Choose your preferences' },
    { label: 'Step 2', description: 'Configure settings' },
    { label: 'Step 3', description: 'Review and confirm' },
  ];

  stepsWithOptional: Step[] = [
    { label: 'Basic Info' },
    { label: 'Additional Details', optional: true },
    { label: 'Confirmation' },
  ];

  stepsWithIcons: Step[] = [
    { label: 'Profile', icon: '👤' },
    { label: 'Billing', icon: '💳' },
    { label: 'Settings', icon: '⚙️' },
    { label: 'Complete', icon: '✓' },
  ];

  stepsWithError: Step[] = [
    { label: 'Personal Info', state: 'completed' },
    { label: 'Payment', state: 'error' },
    { label: 'Confirmation', state: 'upcoming' },
  ];

  accountSetupSteps: Step[] = [
    { label: 'Personal Info', description: 'Your basic details' },
    { label: 'Company', description: 'Organization information' },
    { label: 'Preferences', description: 'Customize your experience', optional: true },
    { label: 'Review', description: 'Confirm your information' },
  ];

  checkoutSteps: Step[] = [
    { label: 'Cart', description: 'Review your items' },
    { label: 'Shipping', description: 'Delivery address' },
    { label: 'Payment', description: 'Payment method' },
    { label: 'Confirm', description: 'Place your order' },
  ];

  basicStepperCurrent = signal(0);
  verticalStepperCurrent = signal(0);
  descStepperCurrent = signal(1);
  linearStepperCurrent = signal(0);
  nonClickStepperCurrent = signal(0);
  optionalStepperCurrent = signal(0);
  iconStepperCurrent = signal(0);
  errorStepperCurrent = signal(1);
  accountStepperCurrent = signal(0);
  checkoutStepperCurrent = signal(0);

  industryOptions: SelectOption[] = [
    { label: 'Technology', value: 'tech' },
    { label: 'Healthcare', value: 'health' },
    { label: 'Finance', value: 'finance' },
    { label: 'Education', value: 'education' },
  ];

  paymentOptions: RadioOption[] = [
    { label: 'Credit Card', value: 'card' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Bank Transfer', value: 'bank' },
  ];

  basicStepperNext(): void {
    if (this.basicStepperCurrent() < this.basicSteps.length - 1) {
      this.basicStepperCurrent.set(this.basicStepperCurrent() + 1);
    }
  }

  basicStepperPrevious(): void {
    if (this.basicStepperCurrent() > 0) {
      this.basicStepperCurrent.set(this.basicStepperCurrent() - 1);
    }
  }

  verticalStepperNext(): void {
    if (this.verticalStepperCurrent() < this.basicSteps.length - 1) {
      this.verticalStepperCurrent.set(this.verticalStepperCurrent() + 1);
    }
  }

  verticalStepperPrevious(): void {
    if (this.verticalStepperCurrent() > 0) {
      this.verticalStepperCurrent.set(this.verticalStepperCurrent() - 1);
    }
  }

  linearStepperNext(): void {
    if (this.linearStepperCurrent() < this.basicSteps.length - 1) {
      this.linearStepperCurrent.set(this.linearStepperCurrent() + 1);
    }
  }

  linearStepperPrevious(): void {
    if (this.linearStepperCurrent() > 0) {
      this.linearStepperCurrent.set(this.linearStepperCurrent() - 1);
    }
  }

  nonClickStepperNext(): void {
    if (this.nonClickStepperCurrent() < this.basicSteps.length - 1) {
      this.nonClickStepperCurrent.set(this.nonClickStepperCurrent() + 1);
    }
  }

  nonClickStepperPrevious(): void {
    if (this.nonClickStepperCurrent() > 0) {
      this.nonClickStepperCurrent.set(this.nonClickStepperCurrent() - 1);
    }
  }

  accountStepperNext(): void {
    if (this.accountStepperCurrent() < this.accountSetupSteps.length - 1) {
      this.accountStepperCurrent.set(this.accountStepperCurrent() + 1);
    } else {
      this.onAccountSetupComplete();
    }
  }

  accountStepperPrevious(): void {
    if (this.accountStepperCurrent() > 0) {
      this.accountStepperCurrent.set(this.accountStepperCurrent() - 1);
    }
  }

  checkoutStepperNext(): void {
    if (this.checkoutStepperCurrent() < this.checkoutSteps.length - 1) {
      this.checkoutStepperCurrent.set(this.checkoutStepperCurrent() + 1);
    } else {
      this.toastService.success('Order placed successfully!', 'Success');
      this.checkoutStepperCurrent.set(0);
    }
  }

  checkoutStepperPrevious(): void {
    if (this.checkoutStepperCurrent() > 0) {
      this.checkoutStepperCurrent.set(this.checkoutStepperCurrent() - 1);
    }
  }

  onAccountSetupComplete(): void {
    this.toastService.success('Account setup completed!', 'Success');
    this.accountStepperCurrent.set(0);
  }

  // Timeline demo data
  basicTimelineItems: TimelineItem[] = [
    {
      title: 'Project Created',
      description: 'Initial project setup and configuration',
      timestamp: '2024-01-01',
      status: 'success',
    },
    {
      title: 'Development Started',
      description: 'Begin coding the main features',
      timestamp: '2024-01-05',
      status: 'success',
    },
    {
      title: 'Testing Phase',
      description: 'Running automated tests and QA',
      timestamp: '2024-01-15',
      status: 'primary',
    },
    {
      title: 'Deployment Scheduled',
      description: 'Preparing for production release',
      timestamp: '2024-01-25',
      status: 'default',
    },
  ];

  detailedTimelineItems: TimelineItem[] = [
    {
      title: 'Order Placed',
      description: 'Customer placed order #12345',
      timestamp: '2 hours ago',
      icon: '🛒',
      status: 'success',
      content: 'Order details: 3 items, Total: $149.99',
    },
    {
      title: 'Payment Confirmed',
      description: 'Payment processed successfully',
      timestamp: '1 hour ago',
      icon: '💳',
      status: 'success',
      content: 'Transaction ID: TXN-789456123',
    },
    {
      title: 'Preparing Shipment',
      description: 'Items being packed for delivery',
      timestamp: '30 minutes ago',
      icon: '📦',
      status: 'primary',
    },
    {
      title: 'Out for Delivery',
      description: 'Package is on its way',
      timestamp: 'Expected in 2 hours',
      icon: '🚚',
      status: 'default',
    },
  ];

  activityTimelineItems: TimelineItem[] = [
    {
      title: 'System Update',
      description: 'Updated to version 2.1.0',
      timestamp: '2024-01-20 14:30',
      status: 'success',
    },
    {
      title: 'Security Scan',
      description: 'No vulnerabilities detected',
      timestamp: '2024-01-20 10:15',
      status: 'success',
    },
    {
      title: 'Backup Failed',
      description: 'Database backup encountered an error',
      timestamp: '2024-01-19 23:00',
      status: 'error',
    },
    {
      title: 'High CPU Usage',
      description: 'CPU usage exceeded 90% for 10 minutes',
      timestamp: '2024-01-19 15:45',
      status: 'warning',
    },
    {
      title: 'New User Registered',
      description: 'john.doe@example.com signed up',
      timestamp: '2024-01-19 09:20',
      status: 'info',
    },
    {
      title: 'Server Maintenance',
      description: 'Scheduled maintenance completed',
      timestamp: '2024-01-18 02:00',
      status: 'success',
    },
  ];

  customIconTimelineItems: TimelineItem[] = [
    {
      title: 'Design Review',
      description: 'UI/UX design approved by stakeholders',
      timestamp: 'Jan 10, 2024',
      icon: '🎨',
      status: 'success',
    },
    {
      title: 'Code Review',
      description: 'Pull request merged to main branch',
      timestamp: 'Jan 12, 2024',
      icon: '👨‍💻',
      status: 'success',
    },
    {
      title: 'Testing',
      description: 'QA team running test suites',
      timestamp: 'Jan 15, 2024',
      icon: '🧪',
      status: 'primary',
    },
    {
      title: 'Documentation',
      description: 'Writing user documentation',
      timestamp: 'Jan 18, 2024',
      icon: '📝',
      status: 'default',
    },
  ];

  // Date Picker demo data
  selectedDate = signal<Date | null>(null);
  selectedDateRange = signal<DateRange>({ start: null, end: null });
  minDate = new Date(2024, 0, 1); // January 1, 2024
  maxDate = new Date(2025, 11, 31); // December 31, 2025
  meetingDate = signal<Date | null>(null);
  vacationRange = signal<DateRange>({ start: null, end: null });
  appointmentDate = signal<Date | null>(null);

  // Helper properties for template
  preselectedDate = new Date(2024, 5, 15);
  preselectedRange = { start: new Date(2024, 5, 10), end: new Date(2024, 5, 20) };
  today = new Date();
  Math = Math; // For Math.ceil in template

  onDateSelect(date: Date): void {
    this.selectedDate.set(date);
    console.log('Selected date:', date);
  }

  onDateRangeSelect(range: DateRange): void {
    this.selectedDateRange.set(range);
    console.log('Selected range:', range);
  }

  onMeetingDateSelect(date: Date): void {
    this.meetingDate.set(date);
    this.toastService.success(
      `Meeting scheduled for ${date.toLocaleDateString()}`,
      'Meeting Scheduled',
    );
  }

  onVacationRangeSelect(range: DateRange): void {
    this.vacationRange.set(range);
    if (range.start && range.end) {
      const days = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
      this.toastService.success(
        `${days} days vacation from ${range.start.toLocaleDateString()} to ${range.end.toLocaleDateString()}`,
        'Vacation Booked',
      );
    }
  }

  // Color Picker demo data
  primaryColor = signal<string>('#3b82f6');
  brandColor = signal<string>('#8b5cf6');
  accentColor = signal<string>('#ec4899');
  backgroundColor = signal<string>('#ffffff');
  colorFormat = signal<ColorFormat>('hex');

  onPrimaryColorChange(color: string): void {
    this.primaryColor.set(color);
    console.log('Primary color changed:', color);
  }

  onBrandColorChange(color: string): void {
    this.brandColor.set(color);
    this.toastService.success(`Brand color updated to ${color}`, 'Color Updated');
  }

  onAccentColorChange(color: string): void {
    this.accentColor.set(color);
  }

  onBackgroundColorChange(color: string): void {
    this.backgroundColor.set(color);
  }

  onColorFormatChange(format: ColorFormat): void {
    this.colorFormat.set(format);
  }

  // Tree View demo data
  fileSystemTree: TreeNode[] = [
    {
      id: '1',
      label: 'Documents',
      icon: '📁',
      children: [
        {
          id: '1-1',
          label: 'Work',
          icon: '📁',
          children: [
            { id: '1-1-1', label: 'report.pdf', icon: '📄' },
            { id: '1-1-2', label: 'presentation.pptx', icon: '📊' },
            { id: '1-1-3', label: 'budget.xlsx', icon: '📈' },
          ],
        },
        {
          id: '1-2',
          label: 'Personal',
          icon: '📁',
          children: [
            { id: '1-2-1', label: 'resume.pdf', icon: '📄' },
            { id: '1-2-2', label: 'photo.jpg', icon: '🖼️' },
          ],
        },
      ],
    },
    {
      id: '2',
      label: 'Pictures',
      icon: '📁',
      children: [
        { id: '2-1', label: 'vacation.jpg', icon: '🖼️' },
        { id: '2-2', label: 'family.png', icon: '🖼️' },
      ],
    },
    {
      id: '3',
      label: 'Downloads',
      icon: '📁',
      children: [
        { id: '3-1', label: 'installer.exe', icon: '⚙️' },
        { id: '3-2', label: 'archive.zip', icon: '📦' },
      ],
    },
  ];

  organizationTree: TreeNode[] = [
    {
      id: 'ceo',
      label: 'Sarah Johnson - CEO',
      icon: '👤',
      children: [
        {
          id: 'eng',
          label: 'Engineering',
          icon: '💻',
          children: [
            { id: 'eng-1', label: 'John Smith - Lead Developer', icon: '👨‍💻' },
            { id: 'eng-2', label: 'Emily Davis - Senior Developer', icon: '👩‍💻' },
            { id: 'eng-3', label: 'Michael Brown - Developer', icon: '👨‍💻' },
          ],
        },
        {
          id: 'design',
          label: 'Design',
          icon: '🎨',
          children: [
            { id: 'design-1', label: 'Lisa Anderson - Lead Designer', icon: '👩‍🎨' },
            { id: 'design-2', label: 'David Wilson - UI/UX Designer', icon: '👨‍🎨' },
          ],
        },
        {
          id: 'marketing',
          label: 'Marketing',
          icon: '📢',
          children: [
            { id: 'marketing-1', label: 'Jennifer Taylor - Marketing Manager', icon: '👩‍💼' },
            { id: 'marketing-2', label: 'Robert Martinez - Content Specialist', icon: '👨‍💼' },
          ],
        },
      ],
    },
  ];

  navigationTree: TreeNode[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      children: [
        { id: 'products-list', label: 'All Products', icon: '📋' },
        { id: 'products-add', label: 'Add Product', icon: '➕' },
        { id: 'products-categories', label: 'Categories', icon: '🏷️' },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '🛒',
      children: [
        { id: 'orders-pending', label: 'Pending', icon: '⏳' },
        { id: 'orders-completed', label: 'Completed', icon: '✅' },
        { id: 'orders-cancelled', label: 'Cancelled', icon: '❌' },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      children: [
        { id: 'settings-profile', label: 'Profile', icon: '👤' },
        { id: 'settings-security', label: 'Security', icon: '🔒' },
        { id: 'settings-notifications', label: 'Notifications', icon: '🔔' },
      ],
    },
  ];

  checklistTree: TreeNode[] = [
    {
      id: 'onboarding',
      label: 'Employee Onboarding',
      selectable: true,
      children: [
        {
          id: 'paperwork',
          label: 'Complete Paperwork',
          selectable: true,
          children: [
            { id: 'paperwork-1', label: 'Sign employment contract', selectable: true },
            { id: 'paperwork-2', label: 'Fill W-4 form', selectable: true },
            { id: 'paperwork-3', label: 'Provide emergency contacts', selectable: true },
          ],
        },
        {
          id: 'equipment',
          label: 'Setup Equipment',
          selectable: true,
          children: [
            { id: 'equipment-1', label: 'Receive laptop', selectable: true },
            { id: 'equipment-2', label: 'Get access badge', selectable: true },
            { id: 'equipment-3', label: 'Configure email', selectable: true },
          ],
        },
        {
          id: 'training',
          label: 'Complete Training',
          selectable: true,
          children: [
            { id: 'training-1', label: 'Watch orientation video', selectable: true },
            { id: 'training-2', label: 'Read company handbook', selectable: true },
            { id: 'training-3', label: 'Attend safety training', selectable: true },
          ],
        },
      ],
    },
  ];

  selectedTreeNodes = signal<TreeNode[]>([]);
  expandedFileNodes = signal<string[]>([]);

  onTreeNodeClick(node: TreeNode): void {
    console.log('Node clicked:', node);
  }

  onTreeNodeSelect(nodes: TreeNode[]): void {
    this.selectedTreeNodes.set(nodes);
    console.log('Selected nodes:', nodes);
  }

  onTreeNodeExpand(node: TreeNode): void {
    console.log('Node expanded:', node);
  }

  onTreeNodeCollapse(node: TreeNode): void {
    console.log('Node collapsed:', node);
  }

  onChecklistSelect(nodes: TreeNode[]): void {
    this.selectedTreeNodes.set(nodes);
    this.toastService.success(
      `${nodes.length} task${nodes.length !== 1 ? 's' : ''} completed`,
      'Progress Updated',
    );
  }
}
