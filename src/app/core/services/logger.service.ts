import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = this.getLogLevel(environment.logLevel);
  }

  debug(message: string, ...args: any[]): void {
    this.log(LogLevel.Debug, message, args);
  }

  info(message: string, ...args: any[]): void {
    this.log(LogLevel.Info, message, args);
  }

  warn(message: string, ...args: any[]): void {
    this.log(LogLevel.Warning, message, args);
  }

  error(message: string, error?: Error, ...args: any[]): void {
    this.log(LogLevel.Error, message, args);
    if (error) {
      console.error(error);
    }
  }

  private log(level: LogLevel, message: string, args: any[]): void {
    if (level < this.logLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const formattedMessage = `[${timestamp}] [${levelName}] ${message}`;

    switch (level) {
      case LogLevel.Debug:
        console.debug(formattedMessage, ...args);
        break;
      case LogLevel.Info:
        console.info(formattedMessage, ...args);
        break;
      case LogLevel.Warning:
        console.warn(formattedMessage, ...args);
        break;
      case LogLevel.Error:
        console.error(formattedMessage, ...args);
        break;
    }
  }

  private getLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug':
        return LogLevel.Debug;
      case 'info':
        return LogLevel.Info;
      case 'warning':
        return LogLevel.Warning;
      case 'error':
        return LogLevel.Error;
      default:
        return LogLevel.Info;
    }
  }
}
