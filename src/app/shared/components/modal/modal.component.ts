import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements AfterViewInit {
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;
  @Input() showClose = true;
  @Input() isOpen = false;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() backdropClick = new EventEmitter<void>();

  @ViewChild('modalContent', { static: false }) modalContent?: ElementRef;

  private previousActiveElement?: HTMLElement;

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.trapFocus();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.closeOnEsc && this.isOpen) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.restoreFocus();
    this.closeEvent.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.backdropClick.emit();
      if (this.closeOnBackdrop) {
        this.close();
      }
    }
  }

  private trapFocus(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    setTimeout(() => {
      const focusableElements = this.modalContent?.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    });
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
}
