import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  handleError(error: Error): void {
    console.error('An error occurred:', error);
    // Implement your error handling logic here
    // For example: logging to a service, showing user notifications, etc.
  }
}