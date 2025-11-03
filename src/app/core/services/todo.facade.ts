import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { TodoActions } from '../../features/todo/store/todo.actions';
import {
  selectAllTodos,
  selectTodosLoading,
  selectTodosError,
  selectActiveTodos,
  selectCompletedTodos,
  selectTodosCount
} from '../../features/todo/store/todo.selectors';
import { CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoFacade {
  private store = inject(Store);

  // Selectors
  todos$ = this.store.select(selectAllTodos);
  loading$ = this.store.select(selectTodosLoading);
  error$ = this.store.select(selectTodosError);
  activeTodos$ = this.store.select(selectActiveTodos);
  completedTodos$ = this.store.select(selectCompletedTodos);
  todosCount$ = this.store.select(selectTodosCount);

  // Actions
  loadTodos(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(todo: CreateTodoDto): void {
    this.store.dispatch(TodoActions.addTodo({ todo }));
  }

  updateTodo(id: number, changes: UpdateTodoDto): void {
    this.store.dispatch(TodoActions.updateTodo({ id, changes }));
  }

  deleteTodo(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }

  toggleTodo(id: number, completed: boolean): void {
    this.store.dispatch(TodoActions.toggleTodo({ id, completed }));
  }
}
