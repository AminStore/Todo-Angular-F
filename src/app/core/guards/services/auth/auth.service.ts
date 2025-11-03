import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(credentials: { username: string; password: string }): Observable<boolean> {
    // Implement actual login logic here
    this.isAuthenticatedSubject.next(true);
    return this.isAuthenticated$;
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }

  getAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}