import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoFacade } from '../../../../core/services/todo.facade';
import { Todo } from '../../../../core/models/todo.model';

type TodoView = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-page.component.html'
})
export class TodoPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(TodoFacade);

  todos$ = this.facade.todos$;
  loading$ = this.facade.loading$;
  private readonly todosState = signal<Todo[]>([]);
  todos = this.todosState.asReadonly();
  filter = signal<TodoView>('all');
  searchQuery = signal('');
  activeNav = signal('Overview');
  showComposer = signal(false);
  isSidebarOpen = signal(false);

  readonly primaryNav = [
    { label: 'Overview', icon: 'home-icon' },
    { label: 'My tasks', icon: 'tasks-icon' },
    { label: 'Calendar', icon: 'calendar-icon' },
    { label: 'Analytics', icon: 'chart-icon' }
  ];

  readonly projects = [
    { name: 'Enterprise Upgrade', color: '#8b80ff' },
    { name: 'Design system', color: '#f3a66f' },
    { name: 'Marketing site', color: '#70d6a5' }
  ];

  readonly weekDays = [
    { label: 'Mon', value: 35, today: false },
    { label: 'Tue', value: 55, today: false },
    { label: 'Wed', value: 27, today: false },
    { label: 'Thu', value: 72, today: true },
    { label: 'Fri', value: 46, today: false },
    { label: 'Sat', value: 20, today: false },
    { label: 'Sun', value: 31, today: false }
  ];

  readonly calendarDays = [
    { label: 'Mon', number: 1, selected: false, muted: true, hasTask: false },
    { label: 'Tue', number: 2, selected: false, muted: true, hasTask: false },
    { label: 'Wed', number: 3, selected: false, muted: false, hasTask: false },
    { label: 'Thu', number: 4, selected: true, muted: false, hasTask: true },
    { label: 'Fri', number: 5, selected: false, muted: false, hasTask: true },
    { label: 'Sat', number: 6, selected: false, muted: false, hasTask: false },
    { label: 'Sun', number: 7, selected: false, muted: false, hasTask: false }
  ];

  readonly todoForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]]
  });

  filteredTodos = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return this.todos().filter(todo => {
      const matchesFilter =
        this.filter() === 'all' ||
        (this.filter() === 'active' && !todo.completed) ||
        (this.filter() === 'completed' && todo.completed);
      const matchesSearch =
        !query ||
        todo.title.toLowerCase().includes(query) ||
        (todo.description || '').toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  });

  activeCount = computed(() => this.todos().filter(todo => !todo.completed).length);
  completedCount = computed(() => this.todos().filter(todo => todo.completed).length);
  progress = computed(() => {
    const total = this.todos().length;
    return total ? Math.round((this.completedCount() / total) * 100) : 0;
  });

  todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
  year = new Date().getFullYear();

  ngOnInit(): void {
    this.facade.loadTodos();
    this.todos$.subscribe(todos => this.todosState.set(todos));
  }

  selectNav(label: string): void {
    this.activeNav.set(label);
    this.isSidebarOpen.set(false);
  }

  selectDay(number: number): void {
    this.calendarDays.forEach(day => (day.selected = day.number === number));
  }

  setFilter(filter: TodoView): void {
    this.filter.set(filter);
  }

  addTodo(): void {
    if (this.todoForm.invalid) return;
    const title = this.todoForm.controls.title.value.trim();
    if (!title) return;
    this.facade.addTodo({ title });
    this.todoForm.reset();
    this.showComposer.set(false);
  }

  toggleTodo(id: number): void {
    const todo = this.todos().find(item => item.id === id);
    if (todo) this.facade.toggleTodo(id, !todo.completed);
  }

  deleteTodo(id: number): void {
    this.facade.deleteTodo(id);
  }

  formatDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.valueOf())
      ? 'No date'
      : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }

  categoryColor(todo: Todo): string {
    return todo.category?.color || '#8b80ff';
  }
}