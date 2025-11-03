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
  `,
  styles: [`
    footer {
      text-align: center;
      padding: 20px;
      margin-top: 40px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
