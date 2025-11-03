// src/app/features/todo/pages/todo-page/todo-page.component.ts
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material/material.module';
import { TodoListComponent } from '../../components/todo-list/todo-list.component';
import { TodoFacade } from '../../../../core/services/todo.facade';
import { Todo } from '../../../../core/models/todo.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TodoListComponent, TranslateModule],
  template: `
    <div class="container">
      <div class="stats-container">
        @if (todosCount$ | async; as count) {
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value">{{ count.total }}</div>
              <div class="stat-label">{{ 'TOTAL' | translate }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value active">{{ count.active }}</div>
              <div class="stat-label">{{ 'ACTIVE' | translate }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-value completed">{{ count.completed }}</div>
              <div class="stat-label">{{ 'COMPLETED' | translate }}</div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <mat-card class="add-todo-card">
        <mat-card-content>
          <form [formGroup]="todoForm" (ngSubmit)="addTodo()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>{{ 'ADD_TODO_PLACEHOLDER' | translate }}</mat-label>
              <input
                matInput
                formControlName="title"
                [placeholder]="'ADD_TODO_PLACEHOLDER' | translate"
                (keyup.enter)="addTodo()">
              @if (todoForm.get('title')?.hasError('required') && todoForm.get('title')?.touched) {
                <mat-error>{{ 'TITLE_REQUIRED' | translate }}</mat-error>
              }
              @if (todoForm.get('title')?.hasError('minlength')) {
                <mat-error>{{ 'TITLE_MIN_LENGTH' | translate }}</mat-error>
              }
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              [disabled]="todoForm.invalid || (loading$ | async)">
              <mat-icon>add</mat-icon>
              {{ 'ADD_TODO' | translate }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="filter-buttons">
        <button
          mat-button
          [class.active]="filter() === 'all'"
          (click)="setFilter('all')">
          {{ 'ALL' | translate }}
        </button>
        <button
          mat-button
          [class.active]="filter() === 'active'"
          (click)="setFilter('active')">
          {{ 'ACTIVE' | translate }}
        </button>
        <button
          mat-button
          [class.active]="filter() === 'completed'"
          (click)="setFilter('completed')">
          {{ 'COMPLETED' | translate }}
        </button>
      </div>

      <app-todo-list
        [todos]="filteredTodos()"
        [loading]="(loading$ | async) ?? false"
        (todoToggle)="toggleTodo($event)"
        (todoDelete)="deleteTodo($event)" />
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      text-align: center;

      mat-card-content {
        padding: 20px;
      }
    }

    .stat-value {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 8px;

      &.active {
        color: #2196F3;
      }

      &.completed {
        color: #4CAF50;
      }
    }

    .stat-label {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.54);
      text-transform: uppercase;
    }

    .add-todo-card {
      margin-bottom: 24px;

      mat-card-content {
        padding: 20px;
      }
    }

    form {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .full-width {
      flex: 1;
    }

    button[type="submit"] {
      margin-top: 8px;
    }

    .filter-buttons {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;

      button {
        &.active {
          background-color: rgba(0, 0, 0, 0.08);
          font-weight: 500;
        }
      }
    }
  `]
})
export class TodoPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private facade = inject(TodoFacade);

  todos$ = this.facade.todos$;
  loading$ = this.facade.loading$;
  todosCount$ = this.facade.todosCount$;

  filter = signal<'all' | 'active' | 'completed'>('all');

  private todos = signal<Todo[]>([]);
  filteredTodos = computed(() => {
    const todos = this.todos();
    switch (this.filter()) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  });

  todoForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit(): void {
    this.facade.loadTodos();

    // Subscribe to todos
    this.todos$.subscribe(todos => {
      this.todos.set(todos);
    });
  }

  setFilter(filter: 'all' | 'active' | 'completed'): void {
    this.filter.set(filter);
  }

  addTodo(): void {
    if (this.todoForm.valid) {
      const title = this.todoForm.value.title!.trim();
      if (title) {
        this.facade.addTodo({ title });
        this.todoForm.reset();
      }
    }
  }

  toggleTodo(id: number): void {
    this.todos$.subscribe(todos => {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        this.facade.toggleTodo(id, !todo.completed);
      }
    });
  }

  deleteTodo(id: number): void {
    this.facade.deleteTodo(id);
  }
}
