import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: { [key: string]: any } = {
    apiUrl: environment.apiBaseUrl,
    production: environment.production,
    version: environment.version,
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'ar'],
    defaultTheme: 'light',
    tokenKey: 'auth_token',
    cacheTTL: 5 * 60 * 1000, // 5 minutes
  };

  get<T>(key: string): T {
    return this.config[key] as T;
  }

  set(key: string, value: any): void {
    this.config[key] = value;
  }
}