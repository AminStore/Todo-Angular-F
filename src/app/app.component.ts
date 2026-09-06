import { Component, OnInit, inject, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoadingService } from './core/guards/services/loading/loading.service';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';
import { MaterialModule } from './shared/material/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterOutlet,
    MaterialModule
  ],
  template: `
    <div class="app-container" [attr.data-theme]="theme()" [dir]="textDirection()">
      <main class="content">
        <div *ngIf="isLoading" class="loading-overlay">
          <mat-spinner></mat-spinner>
        </div>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly themeService = inject(ThemeService);
  private readonly loadingService = inject(LoadingService);

  protected isLoading = false;
  protected theme = this.themeService.theme;
  protected textDirection = () => this.languageService.currentLanguage() === 'ar' ? 'rtl' : 'ltr';

  constructor() {
    // Initialize theme and language effects
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.theme());
    });

    effect(() => {
      document.documentElement.dir = this.textDirection();
      document.documentElement.lang = this.languageService.currentLanguage();
    });
  }

  ngOnInit(): void {
    // Handle global loading state
    this.loadingService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
  }
}

