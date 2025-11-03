// src/app/core/services/language.service.ts
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private readonly LANG_KEY = 'app-language';

  currentLanguage = signal<Language>('en');

  constructor() {
    this.initLanguage();
  }

  private initLanguage(): void {
    const defaultLang: Language = 'en';
    const supportedLangs: Language[] = ['en', 'ar'];

    this.translate.addLangs(supportedLangs);
    this.translate.setDefaultLang(defaultLang);

    let lang: Language = defaultLang;

    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.LANG_KEY) as Language;
      lang = stored && supportedLangs.includes(stored) ? stored : defaultLang;
    }

    this.setLanguage(lang);
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.currentLanguage.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.LANG_KEY, lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage() === 'en' ? 'ar' : 'en';
    this.setLanguage(newLang);
  }
}
