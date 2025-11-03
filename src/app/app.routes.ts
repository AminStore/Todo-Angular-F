// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/features/todo/pages/todo-page/todo-page.component')
        .then(m => m.TodoPageComponent)
  },
  {
    path: '**', redirectTo: ''
  }
];

