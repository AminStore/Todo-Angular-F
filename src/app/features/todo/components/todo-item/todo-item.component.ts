// src/app/features/todo/components/todo-item/todo-item.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material/material.module';
import { Todo } from '../../../../core/models/todo.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, MaterialModule, TranslateModule],
  template: `
    <mat-list-item>
      <mat-checkbox
        [checked]="todo().completed"
        (change)="onToggle()"
        [color]="'primary'">
      </mat-checkbox>
      <span [class.completed]="todo().completed" class="todo-title">
        {{ todo().title }}
      </span>
      <span class="spacer"></span>
      <button
        mat-icon-button
        color="warn"
        (click)="onDelete()"
        [matTooltip]="'DELETE' | translate">
        <mat-icon>delete</mat-icon>
      </button>
    </mat-list-item>
  `,
  styles: [`
    mat-list-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      padding: 12px 0;
    }

    .todo-title {
      margin-left: 12px;
      flex: 1;
      transition: all 0.3s ease;
    }

    .completed {
      text-decoration: line-through;
      opacity: 0.6;
    }

    .spacer {
      flex: 1 1 auto;
    }

    :host-context([dir="rtl"]) .todo-title {
      margin-left: 0;
      margin-right: 12px;
    }
  `]
})
export class TodoItemComponent {
  todo = input.required<Todo>();
  toggle = output<number>();
  delete = output<number>();

  onToggle(): void {
    this.toggle.emit(this.todo().id);
  }

  onDelete(): void {
    this.delete.emit(this.todo().id);
  }
}
