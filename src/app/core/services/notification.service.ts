import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/notifications`;

  getNotifications(userId = 1): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}?userId=${userId}`);
  }
}