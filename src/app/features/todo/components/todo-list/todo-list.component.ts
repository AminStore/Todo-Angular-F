// src/app/features/todo/components/todo-list/todo-list.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Todo } from '../../../../core/models/todo.model';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, TodoItemComponent, TranslateModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'TODO_LIST' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        @if (loading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (todos().length === 0) {
          <div class="empty-state">
            <mat-icon>check_circle_outline</mat-icon>
            <p>{{ 'NO_TODOS' | translate }}</p>
          </div>
        } @else {
          <mat-list>
            @for (todo of todos(); track todo.id) {
              <app-todo-item
                [todo]="todo"
                (toggle)="todoToggle.emit($event)"
                (delete)="todoDelete.emit($event)" />
            }
          </mat-list>
        }
      </mat-card-content>
    </mat-card>
  `
})
export class TodoListComponent {
  todos = input.required<Todo[]>();
  loading = input<boolean>(false);
  todoToggle = output<number>();
  todoDelete = output<number>();
}
