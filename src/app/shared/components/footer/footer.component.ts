// src/app/shared/components/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <footer>
      <p>{{ 'COPYRIGHT' | translate }} © {{ currentYear }}</p>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
