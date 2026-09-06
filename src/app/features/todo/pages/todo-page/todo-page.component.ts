import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TodoFacade } from '../../../../core/services/todo.facade';
import { Todo } from '../../../../core/models/todo.model';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeService } from '../../../../core/services/theme.service';

type TodoView = 'all' | 'active' | 'completed';
type WorkspaceDialog = 'notifications' | 'help' | 'settings' | null;

interface Project {
  name: string;
  color: string;
}

@Component({
  selector: 'app-todo-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-page.component.html'
})
export class TodoPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly facade = inject(TodoFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  todos$ = this.facade.todos$;
  loading$ = this.facade.loading$;
  error$ = this.facade.error$;
  private readonly todosState = signal<Todo[]>([]);
  todos = this.todosState.asReadonly();
  filter = signal<TodoView>('all');
  searchQuery = signal('');
  activeNav = signal('Overview');
  activeProject = signal('Enterprise Upgrade');
  showComposer = signal(false);
  isSidebarOpen = signal(false);
  dialog = signal<WorkspaceDialog>(null);
  showProjectComposer = signal(false);
  projectName = signal('');
  todoToDelete = signal<Todo | null>(null);
  theme = this.themeService.theme;
  language = this.languageService.currentLanguage;

  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  readonly primaryNav = [
    { label: 'Overview', icon: 'home-icon' },
    { label: 'My tasks', icon: 'tasks-icon' },
    { label: 'Calendar', icon: 'calendar-icon' },
    { label: 'Analytics', icon: 'chart-icon' }
  ];

  readonly projects = signal<Project[]>([
    { name: 'Enterprise Upgrade', color: '#8b80ff' },
    { name: 'Design system', color: '#f3a66f' },
    { name: 'Marketing site', color: '#70d6a5' }
  ]);

  readonly weekDays = [
    { label: 'Mon', value: 35, today: false },
    { label: 'Tue', value: 55, today: false },
    { label: 'Wed', value: 27, today: false },
    { label: 'Thu', value: 72, today: true },
    { label: 'Fri', value: 46, today: false },
    { label: 'Sat', value: 20, today: false },
    { label: 'Sun', value: 31, today: false }
  ];

  calendarDays = this.buildCalendarDays();

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
    this.todos$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(todos => this.todosState.set(todos));
  }

  selectNav(label: string): void {
    this.activeNav.set(label);
    if (label === 'Overview') this.setFilter('all');
    if (label === 'My tasks') this.setFilter('active');
    if (label === 'Calendar') this.calendarDays = this.buildCalendarDays();
    this.isSidebarOpen.set(false);
  }

  selectProject(project: Project): void {
    this.activeProject.set(project.name);
    this.activeNav.set(project.name);
    this.isSidebarOpen.set(false);
  }

  openProjectComposer(event?: Event): void {
    event?.stopPropagation();
    this.showProjectComposer.set(true);
  }

  createProject(): void {
    const name = this.projectName().trim();
    if (name.length < 2) return;

    const colors = ['#8b80ff', '#f3a66f', '#70d6a5', '#7ed0e8'];
    const project = {
      name,
      color: colors[this.projects().length % colors.length]
    };
    this.projects.update(projects => [...projects, project]);
    this.selectProject(project);
    this.projectName.set('');
    this.showProjectComposer.set(false);
  }

  selectDay(number: number): void {
    this.calendarDays = this.calendarDays.map(day => ({
      ...day,
      selected: day.number === number
    }));
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
    this.todoToDelete.set(this.todos().find(todo => todo.id === id) || null);
  }

  confirmDelete(): void {
    const todo = this.todoToDelete();
    if (!todo) return;
    this.facade.deleteTodo(todo.id);
    this.todoToDelete.set(null);
  }

  retryLoad(): void {
    this.facade.loadTodos();
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

  openDialog(dialog: Exclude<WorkspaceDialog, null>): void {
    this.dialog.set(dialog);
    this.isSidebarOpen.set(false);
  }

  closeDialog(): void {
    this.dialog.set(null);
    this.showProjectComposer.set(false);
    this.todoToDelete.set(null);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  setLanguage(language: 'en' | 'ar'): void {
    this.languageService.setLanguage(language);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement.focus();
    }

    if (event.key === 'Escape') {
      this.closeDialog();
      this.isSidebarOpen.set(false);
    }
  }

  private buildCalendarDays(): Array<{
    label: string;
    number: number;
    selected: boolean;
    muted: boolean;
    hasTask: boolean;
  }> {
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
        number: date.getDate(),
        selected: date.toDateString() === today.toDateString(),
        muted: date.getMonth() !== today.getMonth(),
        hasTask: false
      };
    });
  }
}