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
import {
  DataGridComponent,
  DataGridColumn,
  DataGridConfig,
} from '@shared/components/data-grid/data-grid.component';
import {
  CarouselComponent,
  CarouselSlide,
  CarouselConfig,
} from '@shared/components/carousel/carousel.component';
import {
  RichTextEditorComponent,
  RichTextEditorConfig,
} from '@shared/components/rich-text-editor/rich-text-editor.component';
import {
  KanbanBoardComponent,
  KanbanColumn,
  KanbanTask,
  KanbanConfig,
} from '@shared/components/kanban-board/kanban-board.component';
import {
  ChartComponent,
  ChartData,
  ChartOptions,
  ChartType,
} from '@shared/components/chart/chart.component';
import {
  NotificationCenterComponent,
  Notification,
  NotificationCenterConfig,
} from '@shared/components/notification-center/notification-center.component';
import {
  CodeEditorComponent,
  CodeLanguage,
  CodeTheme,
  CodeEditorConfig,
} from '@shared/components/code-editor/code-editor.component';
import {
  FormBuilderComponent,
  FormSchema,
  FormField,
  FormBuilderConfig,
} from '@shared/components/form-builder/form-builder.component';
import { SliderComponent } from '@shared/components/slider/slider.component';
import { SwitchComponent } from '@shared/components/switch/switch.component';
import {
  SegmentedControlComponent,
  SegmentedControlOption,
} from '@shared/components/segmented-control/segmented-control.component';

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
    DataGridComponent,
    CarouselComponent,
    RichTextEditorComponent,
    KanbanBoardComponent,
    ChartComponent,
    NotificationCenterComponent,
    CodeEditorComponent,
    FormBuilderComponent,
    SliderComponent,
    SwitchComponent,
    SegmentedControlComponent,
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

  // Data Grid Demo
  employeeGridColumns: DataGridColumn[] = [
    { field: 'id', header: 'ID', sortable: true, width: '80px', type: 'number' },
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'email', header: 'Email', sortable: true, filterable: true },
    { field: 'department', header: 'Department', sortable: true, filterable: true },
    { field: 'role', header: 'Role', sortable: true, filterable: true },
    {
      field: 'salary',
      header: 'Salary',
      sortable: true,
      type: 'number',
      format: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      field: 'hireDate',
      header: 'Hire Date',
      sortable: true,
      type: 'date',
      format: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
    },
  ];

  employeeGridData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      department: 'Engineering',
      role: 'Senior Developer',
      salary: 95000,
      hireDate: new Date('2020-03-15'),
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      department: 'Marketing',
      role: 'Marketing Manager',
      salary: 85000,
      hireDate: new Date('2019-07-22'),
      status: 'Active',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      department: 'Engineering',
      role: 'Tech Lead',
      salary: 120000,
      hireDate: new Date('2018-01-10'),
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@company.com',
      department: 'Sales',
      role: 'Sales Director',
      salary: 110000,
      hireDate: new Date('2019-05-18'),
      status: 'Active',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@company.com',
      department: 'Engineering',
      role: 'Junior Developer',
      salary: 65000,
      hireDate: new Date('2022-09-01'),
      status: 'Active',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      department: 'HR',
      role: 'HR Manager',
      salary: 80000,
      hireDate: new Date('2020-11-30'),
      status: 'Active',
    },
    {
      id: 7,
      name: 'Chris Martinez',
      email: 'chris.martinez@company.com',
      department: 'Engineering',
      role: 'DevOps Engineer',
      salary: 90000,
      hireDate: new Date('2021-02-14'),
      status: 'Active',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      department: 'Marketing',
      role: 'Content Strategist',
      salary: 70000,
      hireDate: new Date('2021-06-20'),
      status: 'Active',
    },
    {
      id: 9,
      name: 'Tom Wilson',
      email: 'tom.wilson@company.com',
      department: 'Sales',
      role: 'Account Executive',
      salary: 75000,
      hireDate: new Date('2020-08-05'),
      status: 'On Leave',
    },
    {
      id: 10,
      name: 'Amy Taylor',
      email: 'amy.taylor@company.com',
      department: 'Engineering',
      role: 'QA Engineer',
      salary: 72000,
      hireDate: new Date('2021-10-12'),
      status: 'Active',
    },
    {
      id: 11,
      name: 'Robert Moore',
      email: 'robert.moore@company.com',
      department: 'Finance',
      role: 'Financial Analyst',
      salary: 78000,
      hireDate: new Date('2019-12-03'),
      status: 'Active',
    },
    {
      id: 12,
      name: 'Jennifer Lee',
      email: 'jennifer.lee@company.com',
      department: 'Design',
      role: 'UX Designer',
      salary: 82000,
      hireDate: new Date('2020-04-25'),
      status: 'Active',
    },
  ];

  dataGridConfig: DataGridConfig = {
    selectable: true,
    multiSelect: true,
    pagination: true,
    pageSize: 5,
    sortable: true,
    filterable: true,
    exportable: true,
    rowHeight: 'normal',
  };

  compactGridConfig: DataGridConfig = {
    ...this.dataGridConfig,
    rowHeight: 'compact',
    pageSize: 8,
  };

  comfortableGridConfig: DataGridConfig = {
    ...this.dataGridConfig,
    rowHeight: 'comfortable',
    pageSize: 4,
  };

  onDataGridRowClick(row: any): void {
    console.log('Row clicked:', row);
    this.toastService.info(`Selected: ${row.name}`, 'Employee Info');
  }

  onDataGridRowSelect(rows: any[]): void {
    console.log('Selected rows:', rows);
  }

  onDataGridSort(sort: any): void {
    console.log('Sort changed:', sort);
  }

  onDataGridFilter(filters: any): void {
    console.log('Filters applied:', filters);
  }

  // Carousel Component Data
  carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
      title: 'Global Network',
      description: 'Connect with teams around the world',
      alt: 'Earth from space with network connections',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      title: 'Data Analytics',
      description: 'Insights that drive business growth',
      alt: 'Business analytics dashboard',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop',
      title: 'Team Collaboration',
      description: 'Work together, achieve more',
      alt: 'Team working together',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
      title: 'Innovation',
      description: 'Building the future of technology',
      alt: 'Technology and innovation',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
      title: 'Success',
      description: 'Your goals, our mission',
      alt: 'Success and achievement',
    },
  ];

  carouselConfig: CarouselConfig = {
    autoPlay: false,
    interval: 4000,
    showIndicators: true,
    showArrows: true,
    showThumbnails: false,
    loop: true,
    pauseOnHover: true,
    transition: 'slide',
    height: '400px',
    objectFit: 'cover',
  };

  autoPlayCarouselConfig: CarouselConfig = {
    ...this.carouselConfig,
    autoPlay: true,
    interval: 3000,
  };

  fadeCarouselConfig: CarouselConfig = {
    ...this.carouselConfig,
    transition: 'fade',
    showThumbnails: false,
  };

  thumbnailCarouselConfig: CarouselConfig = {
    ...this.carouselConfig,
    showThumbnails: true,
    height: '500px',
  };

  compactCarouselSlides: CarouselSlide[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
      title: 'Product Launch',
      alt: 'Product launch event',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
      title: 'Team Meeting',
      alt: 'Team meeting room',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
      title: 'Office Space',
      alt: 'Modern office space',
    },
  ];

  onCarouselSlideChange(index: number): void {
    console.log('Slide changed to:', index);
  }

  onCarouselSlideClick(slide: CarouselSlide): void {
    console.log('Slide clicked:', slide);
    this.toastService.info(slide.title || 'Slide clicked', 'Carousel');
  }

  // Rich Text Editor Component Data
  editorContent = signal('');
  blogContent = signal('<h2>Welcome to our Blog</h2><p>Start writing your content here...</p>');
  commentContent = signal('');
  emailContent = signal('');
  readonlyContent = signal(
    '<h3>Meeting Notes</h3><p>Team discussed project timeline and deliverables. <strong>Action items</strong> assigned to team members.</p><ul><li>Complete design mockups</li><li>Setup development environment</li><li>Schedule client review</li></ul>',
  );
  articleContent = signal(
    '<h2>Product Launch</h2><p>We are excited to announce the launch of our new product line. This innovative solution combines <strong>cutting-edge technology</strong> with user-friendly design.</p><blockquote>Innovation is the key to success</blockquote><p>Learn more about our product features.</p>',
  );

  editorConfig: RichTextEditorConfig = {
    toolbar: true,
    minHeight: '300px',
    placeholder: 'Start typing...',
    readonly: false,
    showCharCount: true,
    maxLength: undefined,
  };

  minimalEditorConfig: RichTextEditorConfig = {
    toolbar: true,
    minHeight: '150px',
    placeholder: 'Write a comment...',
    showCharCount: true,
    maxLength: 500,
    toolbarButtons: ['bold', 'italic', 'underline', 'link'],
  };

  compactEditorConfig: RichTextEditorConfig = {
    toolbar: true,
    minHeight: '100px',
    placeholder: 'Quick note...',
    showCharCount: false,
    toolbarButtons: ['bold', 'italic', 'code'],
  };

  readonlyEditorConfig: RichTextEditorConfig = {
    toolbar: false,
    minHeight: '200px',
    readonly: true,
    showCharCount: false,
  };

  fullEditorConfig: RichTextEditorConfig = {
    toolbar: true,
    minHeight: '400px',
    maxHeight: '600px',
    placeholder: 'Write your blog post...',
    showCharCount: true,
    maxLength: 10000,
  };

  onEditorContentChange(content: string): void {
    console.log('Editor content changed:', content.substring(0, 50) + '...');
  }

  onEditorFocus(): void {
    console.log('Editor focused');
  }

  onEditorBlur(): void {
    console.log('Editor blurred');
  }

  // Kanban Board Component Data
  kanbanColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      color: '#3b82f6',
      tasks: [
        {
          id: 1,
          title: 'Design new landing page',
          description: 'Create wireframes and mockups for the new landing page',
          priority: 'high',
          assignee: 'Alice Johnson',
          tags: ['design', 'ui/ux'],
          dueDate: new Date('2026-01-20'),
          subtasks: 5,
          completedSubtasks: 2,
        },
        {
          id: 2,
          title: 'Update documentation',
          description: 'Add API reference and examples',
          priority: 'medium',
          assignee: 'Bob Smith',
          tags: ['documentation'],
          dueDate: new Date('2026-01-25'),
        },
        {
          id: 3,
          title: 'Research user feedback',
          priority: 'low',
          assignee: 'Carol Davis',
          tags: ['research', 'analytics'],
        },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: '#f59e0b',
      limit: 3,
      tasks: [
        {
          id: 4,
          title: 'Implement authentication',
          description: 'Add JWT-based authentication system',
          priority: 'high',
          assignee: 'David Wilson',
          tags: ['backend', 'security'],
          dueDate: new Date('2026-01-18'),
          subtasks: 8,
          completedSubtasks: 5,
        },
        {
          id: 5,
          title: 'Build dashboard components',
          description: 'Create reusable Angular components',
          priority: 'medium',
          assignee: 'Eve Brown',
          tags: ['frontend', 'angular'],
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      color: '#8b5cf6',
      tasks: [
        {
          id: 6,
          title: 'Code review: User module',
          priority: 'high',
          assignee: 'Frank Miller',
          tags: ['code-review'],
          dueDate: new Date('2026-01-17'),
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: '#10b981',
      tasks: [
        {
          id: 7,
          title: 'Setup CI/CD pipeline',
          description: 'Configure GitHub Actions for automated testing',
          priority: 'medium',
          assignee: 'Grace Lee',
          tags: ['devops', 'automation'],
          subtasks: 4,
          completedSubtasks: 4,
        },
        {
          id: 8,
          title: 'Database schema design',
          priority: 'high',
          assignee: 'Henry Taylor',
          tags: ['database', 'architecture'],
        },
      ],
    },
  ];

  kanbanConfig: KanbanConfig = {
    allowAddTask: true,
    allowEditTask: true,
    allowDeleteTask: true,
    allowDragDrop: true,
    showTaskCount: true,
    showColumnLimit: true,
    compactMode: false,
  };

  simpleKanbanColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ],
    },
    {
      id: 'doing',
      title: 'Doing',
      tasks: [{ id: 3, title: 'Task 3' }],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [{ id: 4, title: 'Task 4' }],
    },
  ];

  onKanbanTaskMove(event: {
    task: KanbanTask;
    fromColumn: string | number;
    toColumn: string | number;
  }): void {
    console.log('Task moved:', event);
    this.toastService.success(`Task "${event.task.title}" moved`, 'Kanban');
  }

  onKanbanTaskAdd(event: { columnId: string | number; task: KanbanTask }): void {
    console.log('Task added:', event);
  }

  onKanbanTaskClick(task: KanbanTask): void {
    console.log('Task clicked:', task);
    this.toastService.info(task.title, 'Task Details');
  }

  // Chart Configuration
  lineChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        borderWidth: 2,
      },
      {
        label: 'Revenue',
        data: [8000, 13000, 10000, 18000, 16000, 24000],
        borderColor: '#10b981',
        backgroundColor: '#10b981',
        borderWidth: 2,
      },
    ],
  };

  barChartData: ChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: '2025',
        data: [45000, 52000, 48000, 61000],
        backgroundColor: '#3b82f6',
      },
      {
        label: '2024',
        data: [38000, 45000, 42000, 53000],
        backgroundColor: '#10b981',
      },
    ],
  };

  pieChartData: ChartData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D'],
    datasets: [
      {
        label: 'Market Share',
        data: [35, 25, 20, 20],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  };

  areaChartData: ChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Active Users',
        data: [1200, 1900, 1500, 2100],
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf6',
        fill: true,
      },
    ],
  };

  doughnutChartData: ChartData = {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [
      {
        label: 'Device Usage',
        data: [45, 40, 15],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    showLegend: true,
    showGrid: true,
    showTooltip: true,
    animationDuration: 800,
    height: 300,
  };

  compactChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    showLegend: false,
    showGrid: false,
    showTooltip: true,
    animationDuration: 500,
    height: 200,
  };

  onChartClick(event: { label: string; value: number; datasetIndex: number }): void {
    console.log('Chart clicked:', event);
    this.toastService.info(`${event.label}: ${event.value}`, 'Chart Data');
  }

  // Notification Center Configuration
  notifications: Notification[] = [
    {
      id: 1,
      type: 'info',
      title: 'New feature released',
      message: 'Check out the new data visualization dashboard with interactive charts.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      type: 'success',
      title: 'Deployment successful',
      message: 'Your application has been deployed to production successfully.',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      title: 'High memory usage detected',
      message: 'Your application is using 85% of available memory.',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: false,
      actionText: 'View Details',
      actionUrl: '/monitoring',
    },
    {
      id: 4,
      type: 'mention',
      title: 'John mentioned you',
      message: '@you Please review the pull request for the authentication feature.',
      timestamp: new Date(Date.now() - 4 * 3600000),
      read: true,
      avatar: 'https://i.pravatar.cc/150?img=2',
      actionText: 'View PR',
    },
    {
      id: 5,
      type: 'error',
      title: 'Build failed',
      message: 'The CI/CD pipeline failed due to test errors in user module.',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      actionText: 'View Logs',
    },
    {
      id: 6,
      type: 'info',
      title: 'Security update available',
      message: 'A new security patch is available for your dependencies.',
      timestamp: new Date(Date.now() - 2 * 86400000),
      read: true,
    },
    {
      id: 7,
      type: 'success',
      title: 'Task completed',
      message: 'Sarah completed the "Design new landing page" task.',
      timestamp: new Date(Date.now() - 3 * 86400000),
      read: true,
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 8,
      type: 'info',
      title: 'Meeting reminder',
      message: 'Team standup meeting starts in 15 minutes.',
      timestamp: new Date(Date.now() - 7 * 86400000),
      read: true,
    },
  ];

  simpleNotifications: Notification[] = [
    {
      id: 1,
      type: 'info',
      title: 'System update',
      message: 'System will be updated tonight at 10 PM.',
      timestamp: new Date(),
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Payment received',
      message: 'Your payment of $99.00 has been processed.',
      timestamp: new Date(Date.now() - 60000),
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Action required',
      message: 'Please verify your email address.',
      timestamp: new Date(Date.now() - 120000),
      read: true,
    },
  ];

  activityNotifications: Notification[] = [
    {
      id: 1,
      type: 'success',
      title: 'Task completed',
      message: 'John completed Design Review task',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 2,
      type: 'info',
      title: 'Comment added',
      message: 'Sarah commented on your pull request',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    {
      id: 3,
      type: 'mention',
      title: 'You were mentioned',
      message: '@you check the latest updates',
      timestamp: new Date(Date.now() - 900000),
      read: true,
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
  ];

  notificationCenterConfig: NotificationCenterConfig = {
    maxHeight: '500px',
    showFilters: true,
    showMarkAllRead: true,
    showClearAll: false,
    groupByDate: true,
    enableActions: true,
  };

  compactNotificationConfig: NotificationCenterConfig = {
    maxHeight: '300px',
    showFilters: false,
    showMarkAllRead: true,
    showClearAll: false,
    groupByDate: false,
    enableActions: false,
  };

  onNotificationClick(notification: Notification): void {
    console.log('Notification clicked:', notification);
    this.toastService.info(notification.title, 'Notification');
  }

  onNotificationRead(notification: Notification): void {
    console.log('Notification read status changed:', notification);
  }

  onNotificationDelete(notification: Notification): void {
    const index = this.notifications.findIndex((n) => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.toastService.success('Notification deleted', 'Success');
    }
  }

  onNotificationAction(notification: Notification): void {
    console.log('Notification action:', notification);
    this.toastService.info(`Action: ${notification.actionText}`, notification.title);
  }

  onMarkAllNotificationsRead(): void {
    console.log('Mark all as read');
    this.toastService.success('All notifications marked as read', 'Success');
  }

  onClearAllNotifications(): void {
    this.notifications = [];
    this.toastService.success('All notifications cleared', 'Success');
  }

  // Code Editor Demo Data
  typescriptCode = signal(`interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

class UserService {
  private users: User[] = [];

  async fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }

  addUser(user: User): void {
    this.users.push(user);
    console.log('User added:', user);
  }
}`);

  javascriptCode = signal(`function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

const cart = [
  { name: 'Book', price: 12.99, quantity: 2 },
  { name: 'Pen', price: 1.50, quantity: 5 }
];

const total = calculateTotal(cart);
console.log('Total:', total);`);

  htmlCode = signal(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <div class="container">
    <h1>Welcome</h1>
    <p>This is a sample page.</p>
    <button onclick="handleClick()">Click Me</button>
  </div>
</body>
</html>`);

  cssCode = signal(`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
  padding: 1rem;
}

.button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}`);

  jsonCode = signal(`{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "webpack": "^5.75.0"
  }
}`);

  pythonCode = signal(`class Calculator:
    def __init__(self):
        self.history = []

    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def get_history(self):
        return self.history

# Usage
calc = Calculator()
print(calc.add(5, 3))  # Output: 8
print(calc.get_history())`);

  sqlCode = signal(`SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;`);

  bashCode = signal(`#!/bin/bash

# Backup script
BACKUP_DIR="/var/backups"
DATE=$(date +%Y%m%d)

echo "Starting backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup database
mysqldump -u root mydb > "$BACKUP_DIR/$DATE/mydb.sql"

# Compress files
tar -czf "$BACKUP_DIR/$DATE/files.tar.gz" /var/www/html

echo "Backup completed: $BACKUP_DIR/$DATE"

# Remove old backups (older than 30 days)
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} +`);

  editorTheme = signal<CodeTheme>('dark');
  editorLanguage = signal<CodeLanguage>('typescript');
  codeEditorConfig: CodeEditorConfig = {
    showLineNumbers: true,
    readOnly: false,
    wordWrap: false,
    fontSize: 14,
    tabSize: 2,
    highlightActiveLine: true,
    autoCloseBrackets: true,
  };

  compactCode = signal(`const greeting = "Hello, World!";
console.log(greeting);`);

  noLineNumbersCode = signal(`// This editor has no line numbers
function example() {
  return true;
}`);

  snippetCode = signal(`import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>Hello</h1>'
})
export class ExampleComponent {}`);

  configCode = signal(`{
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 5000,
    "retries": 3
  },
  "features": {
    "analytics": true,
    "darkMode": false
  }
}`);

  onCodeChange(code: string): void {
    console.log('Code changed:', code.length, 'characters');
  }

  onEditorLanguageChange(language: CodeLanguage): void {
    this.editorLanguage.set(language);
  }

  onEditorThemeChange(theme: CodeTheme): void {
    this.editorTheme.set(theme);
  }

  // Form Builder Demo Data
  contactFormSchema: FormSchema = {
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        required: true,
        width: 'full',
        validation: {
          minLength: 2,
          maxLength: 50,
        },
        hint: 'Enter your full name',
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'john@example.com',
        required: true,
        width: 'half',
        validation: {
          email: true,
        },
      },
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1 (555) 123-4567',
        required: false,
        width: 'half',
        validation: {
          pattern: '^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$',
        },
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'select',
        required: true,
        width: 'full',
        options: [
          { value: 'general', label: 'General Inquiry' },
          { value: 'support', label: 'Technical Support' },
          { value: 'sales', label: 'Sales Question' },
          { value: 'feedback', label: 'Feedback' },
        ],
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        placeholder: 'Enter your message...',
        required: true,
        width: 'full',
        validation: {
          minLength: 10,
          maxLength: 500,
        },
        hint: 'Minimum 10 characters',
      },
      {
        name: 'subscribe',
        label: 'Subscribe to newsletter',
        type: 'checkbox',
        defaultValue: false,
        width: 'full',
      },
    ],
    submitLabel: 'Send Message',
    resetLabel: 'Clear Form',
    showReset: true,
    layout: 'vertical',
  };

  registrationFormSchema: FormSchema = {
    fields: [
      {
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'johndoe',
        required: true,
        width: 'half',
        validation: {
          minLength: 3,
          maxLength: 20,
          pattern: '^[a-zA-Z0-9_]+$',
        },
        hint: 'Alphanumeric and underscores only',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john@example.com',
        required: true,
        width: 'half',
        validation: {
          email: true,
        },
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        required: true,
        width: 'half',
        validation: {
          minLength: 8,
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
        },
        hint: 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number',
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: '••••••••',
        required: true,
        width: 'half',
      },
      {
        name: 'role',
        label: 'Role',
        type: 'radio',
        required: true,
        width: 'full',
        defaultValue: 'user',
        options: [
          { value: 'user', label: 'Regular User' },
          { value: 'admin', label: 'Administrator' },
          { value: 'moderator', label: 'Moderator' },
        ],
      },
      {
        name: 'terms',
        label: 'I agree to the Terms and Conditions',
        type: 'checkbox',
        required: true,
        width: 'full',
      },
    ],
    submitLabel: 'Create Account',
    layout: 'vertical',
  };

  surveyFormSchema: FormSchema = {
    fields: [
      {
        name: 'satisfaction',
        label: 'How satisfied are you with our service?',
        type: 'radio',
        required: true,
        width: 'full',
        options: [
          { value: '5', label: 'Very Satisfied' },
          { value: '4', label: 'Satisfied' },
          { value: '3', label: 'Neutral' },
          { value: '2', label: 'Dissatisfied' },
          { value: '1', label: 'Very Dissatisfied' },
        ],
      },
      {
        name: 'recommend',
        label: 'Would you recommend us to others?',
        type: 'select',
        required: true,
        width: 'full',
        options: [
          { value: 'yes', label: 'Yes, definitely' },
          { value: 'maybe', label: 'Maybe' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        name: 'features',
        label: 'Which features do you use most?',
        type: 'textarea',
        placeholder: 'List the features...',
        width: 'full',
        validation: {
          maxLength: 200,
        },
      },
      {
        name: 'improvements',
        label: 'What can we improve?',
        type: 'textarea',
        placeholder: 'Your suggestions...',
        width: 'full',
        validation: {
          maxLength: 300,
        },
      },
    ],
    submitLabel: 'Submit Survey',
    resetLabel: 'Start Over',
    showReset: true,
    layout: 'vertical',
  };

  jobApplicationSchema: FormSchema = {
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        width: 'half',
        validation: {
          minLength: 2,
        },
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        width: 'half',
        validation: {
          minLength: 2,
        },
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        width: 'half',
        validation: {
          email: true,
        },
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        required: true,
        width: 'half',
      },
      {
        name: 'position',
        label: 'Position',
        type: 'select',
        required: true,
        width: 'full',
        options: [
          { value: 'frontend', label: 'Frontend Developer' },
          { value: 'backend', label: 'Backend Developer' },
          { value: 'fullstack', label: 'Full Stack Developer' },
          { value: 'devops', label: 'DevOps Engineer' },
        ],
      },
      {
        name: 'experience',
        label: 'Years of Experience',
        type: 'number',
        required: true,
        width: 'half',
        validation: {
          min: 0,
          max: 50,
        },
      },
      {
        name: 'startDate',
        label: 'Available Start Date',
        type: 'date',
        required: true,
        width: 'half',
      },
      {
        name: 'coverLetter',
        label: 'Cover Letter',
        type: 'textarea',
        placeholder: 'Tell us why you would be a great fit...',
        required: true,
        width: 'full',
        validation: {
          minLength: 50,
          maxLength: 1000,
        },
      },
      {
        name: 'remote',
        label: 'Willing to work remotely',
        type: 'checkbox',
        defaultValue: false,
        width: 'full',
      },
    ],
    submitLabel: 'Submit Application',
    layout: 'vertical',
  };

  formBuilderConfig: FormBuilderConfig = {
    validateOnChange: true,
    validateOnBlur: true,
    showRequiredIndicator: true,
    showOptionalIndicator: false,
    requiredIndicator: '*',
    optionalIndicator: '(optional)',
  };

  onFormSubmit(formName: string, data: any): void {
    console.log(`${formName} submitted:`, data);
    this.toastService.success('Form submitted successfully!', formName);
  }

  onFormReset(formName: string): void {
    console.log(`${formName} reset`);
    this.toastService.info('Form has been reset', formName);
  }

  onFormValueChange(data: any): void {
    console.log('Form value changed:', data);
  }

  onFormValidationChange(isValid: boolean): void {
    console.log('Form validation changed:', isValid);
  }

  // Slider component demo data
  sliderValue = signal(50);
  rangeSliderValue = signal<[number, number]>([20, 80]);
  priceRangeValue = signal<[number, number]>([0, 1000]);
  volumeValue = signal(75);
  brightnessValue = signal(60);
  temperatureValue = signal(22);

  sliderMarks = [
    { value: 0, label: '0°C' },
    { value: 10, label: '10°C' },
    { value: 20, label: '20°C' },
    { value: 30, label: '30°C' },
  ];

  onSliderChange(value: number | [number, number], name: string): void {
    console.log(`${name} changed:`, value);
  }

  onSlideStart(): void {
    console.log('Slide started');
  }

  onSlideEnd(): void {
    console.log('Slide ended');
  }

  formatPrice(value: number): string {
    return `$${value}`;
  }

  formatPercentage(value: number): string {
    return `${value}%`;
  }

  formatTemperature(value: number): string {
    return `${value}°C`;
  }

  // Switch component demo data
  wifiEnabled = signal(true);
  notificationsEnabled = signal(false);
  darkModeEnabled = signal(false);
  autoSaveEnabled = signal(true);
  bluetoothEnabled = signal(false);
  locationEnabled = signal(true);
  airplaneModeEnabled = signal(false);
  switchLoading = signal(false);

  onSwitchChange(value: boolean, name: string): void {
    console.log(`${name} changed:`, value);
  }

  onSwitchToggle(value: boolean, name: string): void {
    console.log(`${name} toggled:`, value);
  }

  simulateLoading(): void {
    this.switchLoading.set(true);
    setTimeout(() => {
      this.switchLoading.set(false);
      this.toastService.success('Settings updated successfully!');
    }, 2000);
  }

  // Segmented Control component demo data
  viewMode = signal<string | number>('grid');
  textAlign = signal<string | number>('left');
  sortOrder = signal<string | number>('newest');
  chartType = signal<string | number>('line');
  filterStatus = signal<string | number>('all');

  viewModeOptions: SegmentedControlOption[] = [
    { value: 'list', label: 'List', icon: '☰' },
    { value: 'grid', label: 'Grid', icon: '▦' },
    { value: 'kanban', label: 'Kanban', icon: '▤' },
  ];

  textAlignOptions: SegmentedControlOption[] = [
    { value: 'left', label: 'Left', icon: '◧' },
    { value: 'center', label: 'Center', icon: '▬' },
    { value: 'right', label: 'Right', icon: '◨' },
    { value: 'justify', label: 'Justify', icon: '▭' },
  ];

  sortOptions: SegmentedControlOption[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'popular', label: 'Popular' },
  ];

  chartTypeOptions: SegmentedControlOption[] = [
    { value: 'line', label: 'Line', icon: '📈' },
    { value: 'bar', label: 'Bar', icon: '📊' },
    { value: 'pie', label: 'Pie', icon: '🥧' },
    { value: 'area', label: 'Area', icon: '🏔️' },
  ];

  statusOptions: SegmentedControlOption[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived' },
  ];

  timeRangeOptions: SegmentedControlOption[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  onSegmentedControlChange(value: string | number, name: string): void {
    console.log(`${name} changed:`, value);
  }

  onSegmentChange(option: SegmentedControlOption, name: string): void {
    console.log(`${name} segment changed:`, option);
  }
}
