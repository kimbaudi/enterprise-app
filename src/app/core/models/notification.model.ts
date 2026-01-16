/**
 * Notification models
 */

export enum NotificationTypes {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
}

export type NotificationType = `${NotificationTypes}`;

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
    timestamp?: Date;
    action?: NotificationAction;
}

export interface NotificationAction {
    label: string;
    handler: () => void;
}

export interface NotificationOptions {
    duration?: number;
    action?: NotificationAction;
    position?: NotificationPosition;
}

export type NotificationPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export const DEFAULT_NOTIFICATION_DURATION = 5000;
export const DEFAULT_NOTIFICATION_POSITION: NotificationPosition = 'top-right';
