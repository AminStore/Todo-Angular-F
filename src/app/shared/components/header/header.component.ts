// src/app/shared/components/header/header.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, LanguageSwitcherComponent, TranslateModule],
  template: `
    <mat-toolbar color="primary">
      <span>{{ 'APP_TITLE' | translate }}</span>
      <span class="spacer"></span>
      <app-language-switcher />
      <button
        mat-icon-button
        (click)="toggleTheme()"
        [matTooltip]="'TOGGLE_THEME' | translate">
        <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
      </button>
    </mat-toolbar>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);

  isDark = () => this.themeService.theme() === 'dark';

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
