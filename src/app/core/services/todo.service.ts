// src/app/core/services/todo.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/todos`;

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodo(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, {
      ...todo,
      completed: todo.completed || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  updateTodo(id: number, todo: UpdateTodoDto): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiUrl}/${id}`, {
      ...todo,
      updatedAt: new Date().toISOString()
    });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleTodo(id: number, completed: boolean): Observable<Todo> {
    return this.updateTodo(id, { completed });
  }
}
