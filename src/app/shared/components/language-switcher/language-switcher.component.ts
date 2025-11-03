// src/app/shared/components/language-switcher/language-switcher.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule],
  template: `
    <button mat-button [matMenuTriggerFor]="menu">
      <mat-icon>language</mat-icon>
      <span>{{ currentLanguage() === 'en' ? 'EN' : 'عربي' }}</span>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="setLanguage('en')">
        <span>English</span>
      </button>
      <button mat-menu-item (click)="setLanguage('ar')">
        <span>العربية</span>
      </button>
    </mat-menu>
  `
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);

  currentLanguage = this.languageService.currentLanguage;

  setLanguage(lang: 'en' | 'ar'): void {
    this.languageService.setLanguage(lang);
  }
}
