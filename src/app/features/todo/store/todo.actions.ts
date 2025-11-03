// src/app/features/todo/store/todo.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../../../core/models/todo.model';

export const TodoActions = createActionGroup({
  source: 'Todo',
  events: {
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Failure': props<{ error: string }>(),

    'Add Todo': props<{ todo: CreateTodoDto }>(),
    'Add Todo Success': props<{ todo: Todo }>(),
    'Add Todo Failure': props<{ error: string }>(),

    'Update Todo': props<{ id: number; changes: UpdateTodoDto }>(),
    'Update Todo Success': props<{ todo: Todo }>(),
    'Update Todo Failure': props<{ error: string }>(),

    'Delete Todo': props<{ id: number }>(),
    'Delete Todo Success': props<{ id: number }>(),
    'Delete Todo Failure': props<{ error: string }>(),

    'Toggle Todo': props<{ id: number; completed: boolean }>(),
  }
});
