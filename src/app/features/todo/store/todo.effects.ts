// src/app/features/todo/store/todo.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodoService } from '../../../core/services/todo.service';
import { TodoActions } from './todo.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() =>
        this.todoService.getTodos().pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of(TodoActions.loadTodosFailure({ error: error.message })))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(({ todo }) =>
        this.todoService.createTodo(todo).pipe(
          map(newTodo => TodoActions.addTodoSuccess({ todo: newTodo })),
          catchError(error => of(TodoActions.addTodoFailure({ error: error.message })))
        )
      )
    )
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.updateTodo),
      mergeMap(({ id, changes }) =>
        this.todoService.updateTodo(id, changes).pipe(
          map(todo => TodoActions.updateTodoSuccess({ todo })),
          catchError(error => of(TodoActions.updateTodoFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(({ id }) =>
        this.todoService.deleteTodo(id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id })),
          catchError(error => of(TodoActions.deleteTodoFailure({ error: error.message })))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(({ id, completed }) =>
        this.todoService.toggleTodo(id, completed).pipe(
          map(todo => TodoActions.updateTodoSuccess({ todo })),
          catchError(error => of(TodoActions.updateTodoFailure({ error: error.message })))
        )
      )
    )
  );
}
