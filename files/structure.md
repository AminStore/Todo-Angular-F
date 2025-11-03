src/
 ├── app/
 │   ├── core/                             # App-wide singletons, cross-cutting concerns
 │   │   ├── services/
 │   │   │   ├── todo.service.ts           # CRUD operations with the Fake API
 │   │   │   ├── api.service.ts            # Generic HttpClient wrapper (optional)
 │   │   │   ├── theme.service.ts          # Light/Dark mode logic
 │   │   │   └── language.service.ts       # Manages ngx-translate language switching
 │   │   ├── interceptors/
 │   │   │   ├── http-error.interceptor.ts # Handles global HTTP errors
 │   │   │   ├── loading.interceptor.ts    # Toggles a global spinner (optional)
 │   │   │   └── auth.interceptor.ts       # (Optional) Attach token headers later
 │   │   ├── guards/
 │   │   │   └── auth.guard.ts             # (Optional) Route protection logic
 │   │   ├── models/
 │   │   │   └── api-response.model.ts     # Common backend response pattern
 │   │   ├── utils/
 │   │   │   ├── date.util.ts              # Utility helpers (formatting, etc.)
 │   │   │   └── form.util.ts
 │   │   ├── core.module.ts                # Imported once in AppModule
 │   │   └── index.ts
 │   │
 │   ├── features/                         # Domain-level modules (lazy-loaded)
 │   │   └── todo/
 │   │       ├── components/
 │   │       │   ├── todo-list/
 │   │       │   │   ├── todo-list.component.ts
 │   │       │   │   ├── todo-list.component.html
 │   │       │   │   └── todo-list.component.scss
 │   │       │   └── todo-item/
 │   │       │       ├── todo-item.component.ts
 │   │       │       ├── todo-item.component.html
 │   │       │       └── todo-item.component.scss
 │   │       ├── pages/
 │   │       │   └── todo-page/
 │   │       │       ├── todo-page.component.ts
 │   │       │       ├── todo-page.component.html
 │   │       │       └── todo-page.component.scss
 │   │       ├── store/                    # (Optional) NgRx state management for Todo
 │   │       │   ├── todo.actions.ts
 │   │       │   ├── todo.reducer.ts
 │   │       │   ├── todo.effects.ts
 │   │       │   └── todo.selectors.ts
 │   │       ├── models/
 │   │       │   └── todo.model.ts         # Interface for Todo (id, title, completed)
 │   │       ├── services/
 │   │       │   └── todo.facade.ts        # Business logic layer (calls todo.service)
 │   │       ├── todo-routing.module.ts
 │   │       └── todo.module.ts
 │   │
 │   ├── shared/                           # Reusable UI building blocks
 │   │   ├── components/
 │   │   │   ├── header/
 │   │   │   │   ├── header.component.ts
 │   │   │   │   ├── header.component.html
 │   │   │   │   └── header.component.scss
 │   │   │   ├── footer/
 │   │   │   │   ├── footer.component.ts
 │   │   │   │   ├── footer.component.html
 │   │   │   │   └── footer.component.scss
 │   │   │   └── language-switcher/
 │   │   │       ├── language-switcher.component.ts
 │   │   │       ├── language-switcher.component.html
 │   │   │       └── language-switcher.component.scss
 │   │   ├── directives/
 │   │   │   └── autofocus.directive.ts
 │   │   ├── pipes/
 │   │   │   ├── truncate.pipe.ts
 │   │   │   └── date-format.pipe.ts
 │   │   ├── material/
 │   │   │   └── material.module.ts        # Central Material imports (MatButton, etc.)
 │   │   ├── validators/
 │   │   │   └── todo.validators.ts
 │   │   └── shared.module.ts              # Export shared components/pipes
 │   │
 │   ├── translations/
 │   │   ├── en.json
 │   │   └── ar.json
 │   │
 │   ├── app.component.ts
 │   ├── app.component.html
 │   ├── app.component.scss
 │   ├── app.routes.ts
 │   └── app.module.ts
 │
 ├── assets/
 │   ├── icons/
 │   ├── images/
 │   ├── i18n/                             # translations moved here for production
 │   │   ├── en.json
 │   │   └── ar.json
 │   └── styles/
 │       ├── _variables.scss
 │       ├── _mixins.scss
 │       ├── _themes.scss
 │       └── main.scss
 │
 ├── environments/
 │   ├── environment.ts
 │   └── environment.prod.ts
 │
 ├── index.html
 ├── main.ts
 └── styles.scss



Future-Ready Additions
state/ folder for NgRx global state (if app grows large).
layout/ folder for app-wide templates (navbar/sidebar shell).
testing/ folder for mock data and helper test utilities.
