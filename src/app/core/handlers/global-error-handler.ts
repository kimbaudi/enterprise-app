import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';

/**
 * Global error handler for catching and logging all application errors
 * Implements Angular's ErrorHandler interface
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);
  private notificationService = inject(NotificationService);

  handleError(error: Error | HttpErrorResponse): void {
    let errorMessage = 'An unexpected error occurred';
    let stackTrace = '';

    if (error instanceof HttpErrorResponse) {
      // Server or network error
      errorMessage = this.getServerErrorMessage(error);
      this.logger.error('HTTP Error', error);
    } else {
      // Client-side error
      errorMessage = this.getClientErrorMessage(error);
      stackTrace = error.stack || '';
      this.logger.error('Client Error', error);
    }

    // Log to console in development
    if (this.isDevelopment()) {
      console.error('Global Error Handler:', error);
      if (stackTrace) {
        console.error('Stack trace:', stackTrace);
      }
    }

    // Show user-friendly notification
    this.notificationService.showError(errorMessage);

    // In production, you might want to send errors to a logging service
    // this.sendErrorToLoggingService(error);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    if (!navigator.onLine) {
      return 'No internet connection';
    }

    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 400:
        return 'Bad request';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Internal server error';
      case 503:
        return 'Service unavailable';
      default:
        return `Server error: ${error.status}`;
    }
  }

  private getClientErrorMessage(error: Error): string {
    return error.message || 'An unexpected error occurred';
  }

  private isDevelopment(): boolean {
    return !window.location.hostname.includes('production');
  }

  // Uncomment and implement if you want to send errors to a logging service
  // private sendErrorToLoggingService(error: Error | HttpErrorResponse): void {
  //     // Send to external logging service (e.g., Sentry, LogRocket)
  // }
}
