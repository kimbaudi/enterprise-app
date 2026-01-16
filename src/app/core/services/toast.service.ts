import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private idCounter = 0;

  getToasts() {
    return this.toasts;
  }

  show(config: Omit<Toast, 'id'>): string {
    const id = `toast-${++this.idCounter}`;
    const toast: Toast = {
      id,
      type: config.type,
      title: config.title,
      message: config.message,
      duration: config.duration ?? 5000,
      dismissible: config.dismissible ?? true,
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  success(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'success', message, title, duration });
  }

  error(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'error', message, title, duration });
  }

  warning(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'warning', message, title, duration });
  }

  info(message: string, title?: string, duration?: number): string {
    return this.show({ type: 'info', message, title, duration });
  }

  dismiss(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
