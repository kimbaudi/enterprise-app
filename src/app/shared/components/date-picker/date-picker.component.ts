import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DatePickerMode = 'single' | 'range';
export type DatePickerView = 'days' | 'months' | 'years';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
})
export class DatePickerComponent {
  @Input() mode: DatePickerMode = 'single';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() disabled = false;
  @Input() showWeekNumbers = false;
  @Input() highlightToday = true;
  @Input() inline = false;

  @Input() set value(date: Date | null) {
    if (date) {
      this.selectedDate.set(date);
      this.currentMonth.set(date.getMonth());
      this.currentYear.set(date.getFullYear());
    }
  }

  @Input() set range(dateRange: DateRange | null) {
    if (dateRange) {
      this.selectedRange.set(dateRange);
      if (dateRange.start) {
        this.currentMonth.set(dateRange.start.getMonth());
        this.currentYear.set(dateRange.start.getFullYear());
      }
    }
  }

  @Output() valueChange = new EventEmitter<Date>();
  @Output() rangeChange = new EventEmitter<DateRange>();

  selectedDate = signal<Date | null>(null);
  selectedRange = signal<DateRange>({ start: null, end: null });
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  currentView = signal<DatePickerView>('days');
  today = new Date();

  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { date: Date; isCurrentMonth: boolean; weekNumber?: number }[] = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        weekNumber: this.showWeekNumbers ? this.getWeekNumber(date) : undefined,
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  });

  monthsGrid = computed(() => {
    return this.monthNames.map((name, index) => ({
      name: name.substring(0, 3),
      fullName: name,
      index,
    }));
  });

  yearsGrid = computed(() => {
    const currentYear = this.currentYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    return Array.from({ length: 12 }, (_, i) => startYear + i);
  });

  currentMonthName = computed(() => this.monthNames[this.currentMonth()]);

  previousMonth(): void {
    if (this.disabled) return;
    const month = this.currentMonth();
    if (month === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(month - 1);
    }
  }

  nextMonth(): void {
    if (this.disabled) return;
    const month = this.currentMonth();
    if (month === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(month + 1);
    }
  }

  previousYear(): void {
    if (this.disabled) return;
    this.currentYear.set(this.currentYear() - 1);
  }

  nextYear(): void {
    if (this.disabled) return;
    this.currentYear.set(this.currentYear() + 1);
  }

  previousYears(): void {
    if (this.disabled) return;
    this.currentYear.set(this.currentYear() - 12);
  }

  nextYears(): void {
    if (this.disabled) return;
    this.currentYear.set(this.currentYear() + 12);
  }

  selectDate(date: Date): void {
    if (this.disabled || !this.isDateSelectable(date)) return;

    if (this.mode === 'single') {
      this.selectedDate.set(date);
      this.valueChange.emit(date);
    } else {
      const range = this.selectedRange();
      if (!range.start || (range.start && range.end)) {
        // Start new range
        this.selectedRange.set({ start: date, end: null });
      } else {
        // Complete range
        if (date >= range.start) {
          this.selectedRange.set({ start: range.start, end: date });
        } else {
          this.selectedRange.set({ start: date, end: range.start });
        }
        this.rangeChange.emit(this.selectedRange());
      }
    }
  }

  selectMonth(monthIndex: number): void {
    if (this.disabled) return;
    this.currentMonth.set(monthIndex);
    this.currentView.set('days');
  }

  selectYear(year: number): void {
    if (this.disabled) return;
    this.currentYear.set(year);
    this.currentView.set('months');
  }

  isDateSelected(date: Date): boolean {
    if (this.mode === 'single') {
      const selected = this.selectedDate();
      return selected ? this.isSameDay(date, selected) : false;
    } else {
      const range = this.selectedRange();
      if (range.start && this.isSameDay(date, range.start)) return true;
      if (range.end && this.isSameDay(date, range.end)) return true;
      return false;
    }
  }

  isDateInRange(date: Date): boolean {
    if (this.mode !== 'range') return false;
    const range = this.selectedRange();
    if (!range.start || !range.end) return false;
    return date > range.start && date < range.end;
  }

  isDateToday(date: Date): boolean {
    return this.isSameDay(date, this.today);
  }

  isDateSelectable(date: Date): boolean {
    if (this.minDate && date < this.minDate) return false;
    if (this.maxDate && date > this.maxDate) return false;
    return true;
  }

  isMonthSelected(monthIndex: number): boolean {
    return monthIndex === this.currentMonth();
  }

  isYearSelected(year: number): boolean {
    return year === this.currentYear();
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  showMonthView(): void {
    if (this.disabled) return;
    this.currentView.set('months');
  }

  showYearView(): void {
    if (this.disabled) return;
    this.currentView.set('years');
  }

  goToToday(): void {
    if (this.disabled) return;
    this.currentMonth.set(this.today.getMonth());
    this.currentYear.set(this.today.getFullYear());
    this.currentView.set('days');
  }
}
