// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

bootstrapApplication(AppComponent, {
  providers: [
    // Standalone Router
    provideRouter(routes),

    // Angular Material / Animations
    provideAnimations(),

    // Global providers for HttpClient + TranslateModule
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot()
    ),

    // Provide HttpLoader for ngx-translate (Angular 20+)
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
      enforceLoading: true,  // optional: waits for translations before app loads
      useHttpBackend: false   // optional: default false
    })
  ]
}).catch(err => console.error(err));
