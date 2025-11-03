import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {  AppComponent } from './app.component';

// Configuration constants for i18n
const I18N_CONFIG = {
  assetsPath: './assets/i18n/',
  fileExtension: '.json'
};

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  if (!http) {
    throw new Error('HttpClient is required for HttpLoaderFactory');
  }
  return new TranslateHttpLoader(http, I18N_CONFIG.assetsPath, I18N_CONFIG.fileExtension);
}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
