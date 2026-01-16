import { Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    private logger = inject(LoggerService);

    logError(error: any): void {
        const errorMessage = this.getErrorMessage(error);
        const stackTrace = this.getStackTrace(error);

        this.logger.error('Application Error:', error);

        // In production, you might want to send errors to a remote logging service
        // this.sendToRemoteLoggingService(errorMessage, stackTrace);
    }

    private getErrorMessage(error: any): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        if (error?.error?.message) {
            return error.error.message;
        }
        if (error?.message) {
            return error.message;
        }
        return 'An unknown error occurred';
    }

    private getStackTrace(error: any): string {
        if (error instanceof Error && error.stack) {
            return error.stack;
        }
        return '';
    }
}
