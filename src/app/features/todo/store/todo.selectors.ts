// src/app/features/todo/store/todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState = createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state) => state.todos
);

export const selectTodosLoading = createSelector(
  selectTodoState,
  (state) => state.loading
);

export const selectTodosError = createSelector(
  selectTodoState,
  (state) => state.error
);

export const selectActiveTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(t => !t.completed)
);

export const selectCompletedTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(t => t.completed)
);

export const selectTodosCount = createSelector(
  selectAllTodos,
  (todos) => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  })
);
