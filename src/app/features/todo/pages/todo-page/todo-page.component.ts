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
  template: `
    <div class="workspace-shell">
      <aside class="sidebar" [class.sidebar--open]="isSidebarOpen()">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <span class="brand-name">taskly</span>
          <button class="mobile-close" type="button" (click)="isSidebarOpen.set(false)" aria-label="Close menu">×</button>
        </div>

        <div class="workspace-switcher">
          <div class="workspace-avatar">M</div>
          <div class="workspace-copy">
            <span class="eyebrow">Workspace</span>
            <strong>Mostafa's team</strong>
          </div>
          <span class="chevron" aria-hidden="true">⌄</span>
        </div>

        <nav class="sidebar-nav" aria-label="Workspace navigation">
          <span class="nav-label">Workspace</span>
          <button
            *ngFor="let item of primaryNav"
            type="button"
            class="nav-item"
            [class.nav-item--active]="activeNav() === item.label"
            (click)="selectNav(item.label)">
            <span class="nav-icon" [class]="item.icon" aria-hidden="true"></span>
            <span>{{ item.label }}</span>
            <span class="nav-count" *ngIf="item.label === 'My tasks'">{{ activeCount() }}</span>
          </button>

          <span class="nav-label nav-label--projects">Projects <button type="button" class="tiny-add" aria-label="Add project">+</button></span>
          <button
            *ngFor="let project of projects"
            type="button"
            class="project-item"
            (click)="selectNav(project.name)">
            <span class="project-dot" [style.background]="project.color"></span>
            <span>{{ project.name }}</span>
            <span class="project-more" aria-hidden="true">···</span>
          </button>
        </nav>

        <div class="sidebar-bottom">
          <button class="sidebar-utility" type="button" (click)="selectNav('Settings')">
            <span class="nav-icon settings-icon" aria-hidden="true"></span>
            <span>Settings</span>
          </button>
          <div class="profile-card">
            <div class="profile-avatar">MM</div>
            <div class="profile-copy">
              <strong>Mostafa Mohamed</strong>
              <span>Product designer</span>
            </div>
            <button type="button" class="profile-more" aria-label="Profile options">···</button>
          </div>
        </div>
      </aside>

      <div class="sidebar-backdrop" *ngIf="isSidebarOpen()" (click)="isSidebarOpen.set(false)"></div>

      <main class="dashboard">
        <header class="topbar">
          <button class="mobile-menu" type="button" (click)="isSidebarOpen.set(true)" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
          <div class="breadcrumb">
            <span class="muted">Workspace</span>
            <span class="breadcrumb-separator">/</span>
            <strong>{{ activeNav() }}</strong>
          </div>
          <div class="topbar-actions">
            <label class="search-box">
              <span class="search-icon" aria-hidden="true"></span>
              <input
                type="search"
                [value]="searchQuery()"
                (input)="searchQuery.set($any($event.target).value)"
                placeholder="Search tasks..."
                aria-label="Search tasks">
              <span class="search-shortcut">⌘ K</span>
            </label>
            <button type="button" class="topbar-icon notification-button" aria-label="Notifications">
              <span class="bell-icon" aria-hidden="true"></span>
              <i></i>
            </button>
            <button type="button" class="topbar-icon" aria-label="Help">?</button>
            <div class="topbar-avatar">MM</div>
          </div>
        </header>

        <div class="dashboard-content">
          <section class="welcome-row">
            <div>
              <div class="date-kicker">{{ todayLabel }}</div>
              <h1>Good morning, Mostafa <span class="wave" aria-hidden="true">✦</span></h1>
              <p>Here’s what’s happening with your tasks today.</p>
            </div>
            <button type="button" class="primary-button" (click)="showComposer.set(!showComposer())">
              <span class="plus-symbol" aria-hidden="true">+</span>
              Add new task
            </button>
          </section>

          <form
            *ngIf="showComposer()"
            class="composer"
            [formGroup]="todoForm"
            (ngSubmit)="addTodo()">
            <div class="composer-input">
              <span class="composer-check" aria-hidden="true"></span>
              <input formControlName="title" placeholder="What needs to be done?" autofocus>
            </div>
            <span class="composer-hint">Press Enter to add</span>
            <button type="submit" [disabled]="todoForm.invalid">Add task</button>
          </form>

          <section class="overview-grid">
            <article class="focus-card">
              <div class="focus-orbit orbit-one"></div>
              <div class="focus-orbit orbit-two"></div>
              <div class="focus-topline">
                <span class="focus-pill"><span class="focus-pill-dot"></span> Focus of the week</span>
                <button type="button" class="card-menu" aria-label="Focus options">···</button>
              </div>
              <div class="focus-content">
                <div class="focus-icon" aria-hidden="true">✦</div>
                <div>
                  <span class="focus-label">Current project</span>
                  <h2>Enterprise Angular Upgrade</h2>
                  <p>Keep the core experience moving forward, one meaningful task at a time.</p>
                </div>
              </div>
              <div class="focus-progress-row">
                <div class="progress-track"><span [style.width.%]="progress()"></span></div>
                <strong>{{ progress() }}%</strong>
              </div>
              <div class="focus-footer">
                <div class="avatar-stack">
                  <span class="mini-avatar avatar-purple">M</span>
                  <span class="mini-avatar avatar-orange">S</span>
                  <span class="mini-avatar avatar-blue">A</span>
                  <span class="avatar-extra">+3</span>
                </div>
                <span class="focus-due">Due in 12 days <span aria-hidden="true">→</span></span>
              </div>
            </article>

            <article class="week-card">
              <div class="section-heading">
                <div>
                  <span class="section-overline">Productivity</span>
                  <h2>Week at a glance</h2>
                </div>
                <button type="button" class="icon-button" aria-label="More productivity options">···</button>
              </div>
              <div class="week-stats">
                <div><strong>{{ completedCount() }}</strong><span>Completed</span></div>
                <div><strong>{{ activeCount() }}</strong><span>In progress</span></div>
                <div><strong>{{ todos().length }}</strong><span>Total tasks</span></div>
              </div>
              <div class="bar-chart" aria-label="Weekly task activity">
                <div class="bar-group" *ngFor="let day of weekDays" [class.bar-group--today]="day.today">
                  <div class="bar-rail"><span [style.height.%]="day.value"></span></div>
                  <span>{{ day.label }}</span>
                </div>
              </div>
            </article>
          </section>

          <section class="calendar-strip">
            <div class="calendar-copy">
              <span class="section-overline">Your schedule</span>
              <h2>{{ monthName }} <span>{{ year }}</span></h2>
            </div>
            <div class="calendar-days">
              <button
                *ngFor="let day of calendarDays"
                type="button"
                class="calendar-day"
                [class.calendar-day--selected]="day.selected"
                [class.calendar-day--muted]="day.muted"
                (click)="selectDay(day.number)">
                <span>{{ day.label }}</span>
                <strong>{{ day.number }}</strong>
                <i *ngIf="day.hasTask"></i>
              </button>
            </div>
            <button type="button" class="outline-button">Open calendar <span aria-hidden="true">→</span></button>
          </section>

          <section class="tasks-section">
            <div class="tasks-header">
              <div>
                <span class="section-overline">Task list</span>
                <h2>{{ activeNav() === 'Overview' ? 'Your tasks' : activeNav() }}</h2>
              </div>
              <div class="view-toggle" role="tablist" aria-label="Task filters">
                <button type="button" [class.active]="filter() === 'all'" (click)="setFilter('all')">All <span>{{ todos().length }}</span></button>
                <button type="button" [class.active]="filter() === 'active'" (click)="setFilter('active')">In progress <span>{{ activeCount() }}</span></button>
                <button type="button" [class.active]="filter() === 'completed'" (click)="setFilter('completed')">Completed <span>{{ completedCount() }}</span></button>
              </div>
            </div>

            <div class="tasks-list">
              <ng-container *ngIf="filteredTodos().length; else emptyTasks">
                <article class="task-row" *ngFor="let todo of filteredTodos(); let index = index" [class.task-row--done]="todo.completed">
                  <button
                    type="button"
                    class="task-check"
                    [class.task-check--done]="todo.completed"
                    (click)="toggleTodo(todo.id)"
                    [attr.aria-label]="todo.completed ? 'Mark task as in progress' : 'Mark task as complete'">
                    <span *ngIf="todo.completed" aria-hidden="true">✓</span>
                  </button>
                  <div class="task-main">
                    <div class="task-title-line">
                      <h3>{{ todo.title }}</h3>
                      <span class="priority" [class]="'priority priority--' + todo.priority.toLowerCase()">{{ todo.priority }}</span>
                    </div>
                    <p>{{ todo.description || 'No description added yet. Keep the details close to the work.' }}</p>
                    <div class="task-meta">
                      <span class="task-project"><i [style.background]="categoryColor(todo)" aria-hidden="true"></i>{{ todo.category?.name || 'Frontend' }}</span>
                      <span class="meta-separator">·</span>
                      <span>Due {{ formatDate(todo.dueDate) }}</span>
                    </div>
                  </div>
                  <div class="task-assignees">
                    <span class="mini-avatar avatar-purple">M</span>
                    <span class="mini-avatar avatar-orange">S</span>
                  </div>
                  <button type="button" class="task-menu" (click)="deleteTodo(todo.id)" [attr.aria-label]="'Delete ' + todo.title">···</button>
                </article>
              </ng-container>
              <ng-template #emptyTasks>
                <div class="empty-tasks">
                  <div class="empty-icon">✓</div>
                  <h3>{{ searchQuery() ? 'No matching tasks' : 'Nothing here yet' }}</h3>
                  <p>{{ searchQuery() ? 'Try a different search term.' : 'Add your first task to start making progress.' }}</p>
                  <button type="button" class="secondary-button" (click)="showComposer.set(true)">Create a task</button>
                </div>
              </ng-template>
            </div>
          </section>

          <footer class="dashboard-footer">
            <span>Made for focused work</span>
            <span class="footer-links"><button type="button">Keyboard shortcuts</button><button type="button">Help center</button></span>
          </footer>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      --ink: #f7f7fb;
      --muted: #9b9caf;
      --subtle: #6c6c7e;
      --panel: #191a27;
      --panel-light: #202130;
      --line: rgba(255, 255, 255, .08);
      --purple: #7568f6;
      --purple-light: #aaa0ff;
      --green: #70d6a5;
    }

    button {
      border: 0;
      cursor: pointer;
    }

    .workspace-shell {
      display: flex;
      min-height: 100vh;
      background: #10111a;
      color: var(--ink);
    }

    .sidebar {
      display: flex;
      position: sticky;
      top: 0;
      flex: 0 0 252px;
      flex-direction: column;
      width: 252px;
      height: 100vh;
      padding: 30px 18px 20px;
      background: #151621;
      z-index: 20;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 12px 32px;
    }

    .brand-name {
      font: 700 23px/1 'Space Grotesk', sans-serif;
      letter-spacing: -.8px;
    }

    .brand-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      width: 26px;
      height: 26px;
      transform: rotate(-12deg);
      border-radius: 8px;
      background: linear-gradient(145deg, #a298ff, #6253e9);
      box-shadow: 0 6px 18px rgba(117, 104, 246, .3);
    }

    .brand-mark span {
      width: 4px;
      border-radius: 3px;
      background: white;
    }

    .brand-mark span:nth-child(1) { height: 9px; opacity: .7; }
    .brand-mark span:nth-child(2) { height: 15px; }
    .brand-mark span:nth-child(3) { height: 11px; opacity: .8; }

    .workspace-switcher {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 10px;
      margin-bottom: 29px;
      border: 1px solid var(--line);
      border-radius: 13px;
      background: rgba(255, 255, 255, .035);
    }

    .workspace-avatar,
    .profile-avatar,
    .topbar-avatar {
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 10px;
      background: linear-gradient(135deg, #f09c8d, #7568f6 80%);
      color: white;
      font-size: 11px;
      font-weight: 700;
    }

    .workspace-avatar { width: 28px; height: 28px; }

    .workspace-copy {
      display: grid;
      flex: 1;
      gap: 3px;
      min-width: 0;
    }

    .workspace-copy strong {
      overflow: hidden;
      font-size: 12px;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .eyebrow, .nav-label, .section-overline {
      color: var(--subtle);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .chevron {
      color: var(--muted);
      font-size: 17px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .nav-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px 9px;
    }

    .nav-label--projects { padding-top: 27px; }

    .tiny-add {
      width: 18px;
      height: 18px;
      padding: 0;
      border-radius: 5px;
      background: rgba(255, 255, 255, .07);
      color: var(--muted);
      font-size: 15px;
      line-height: 16px;
    }

    .nav-item, .project-item, .sidebar-utility {
      display: flex;
      align-items: center;
      gap: 11px;
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      background: transparent;
      color: var(--muted);
      font-size: 13px;
      text-align: left;
      transition: .2s ease;
    }

    .nav-item:hover, .project-item:hover, .sidebar-utility:hover {
      background: rgba(255, 255, 255, .05);
      color: var(--ink);
    }

    .nav-item--active {
      background: linear-gradient(90deg, rgba(117, 104, 246, .19), rgba(117, 104, 246, .04));
      color: #c7c1ff;
    }

    .nav-icon {
      position: relative;
      width: 16px;
      height: 16px;
      opacity: .85;
    }

    .home-icon::before, .tasks-icon::before, .calendar-icon::before, .chart-icon::before, .folder-icon::before, .settings-icon::before {
      position: absolute;
      inset: 2px;
      border: 1.5px solid currentColor;
      border-radius: 4px;
      content: '';
    }

    .home-icon::before { transform: rotate(45deg) scale(.7); border-radius: 2px; top: 3px; }
    .tasks-icon::after, .settings-icon::after { position: absolute; top: 5px; left: 4px; width: 8px; height: 1px; background: currentColor; box-shadow: 0 4px currentColor; content: ''; }
    .calendar-icon::after { position: absolute; top: 6px; left: 4px; width: 8px; height: 1px; background: currentColor; box-shadow: 0 3px currentColor; content: ''; }
    .chart-icon::before { border-width: 0 0 1.5px 1.5px; border-radius: 0; }
    .chart-icon::after { position: absolute; left: 4px; bottom: 3px; width: 2px; height: 6px; background: currentColor; box-shadow: 4px -3px currentColor, 8px -7px currentColor; content: ''; }
    .folder-icon::before { border-radius: 2px; top: 4px; }
    .settings-icon::before { border-radius: 50%; inset: 3px; }
    .settings-icon::after { top: 7px; left: 7px; width: 3px; height: 3px; border-radius: 50%; box-shadow: none; }

    .nav-count {
      min-width: 20px;
      margin-left: auto;
      padding: 2px 6px;
      border-radius: 20px;
      background: rgba(117, 104, 246, .16);
      color: #aca4ff;
      font-size: 10px;
      text-align: center;
    }

    .project-item { padding-top: 8px; padding-bottom: 8px; }
    .project-dot { width: 8px; height: 8px; border-radius: 3px; }
    .project-more { margin-left: auto; color: var(--subtle); letter-spacing: 1px; }

    .sidebar-bottom { margin-top: auto; }
    .sidebar-utility { margin-bottom: 15px; }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 12px 7px 0;
      border-top: 1px solid var(--line);
    }

    .profile-avatar { width: 31px; height: 31px; border-radius: 50%; font-size: 9px; }
    .profile-copy { display: grid; flex: 1; gap: 3px; min-width: 0; }
    .profile-copy strong { overflow: hidden; font-size: 11px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
    .profile-copy span { color: var(--subtle); font-size: 10px; }
    .profile-more, .card-menu, .icon-button, .task-menu { background: transparent; color: var(--muted); letter-spacing: 2px; }
    .profile-more { padding: 6px 0 6px 5px; }
    .mobile-close, .mobile-menu, .sidebar-backdrop { display: none; }

    .dashboard { flex: 1; min-width: 0; }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 82px;
      padding: 0 clamp(24px, 4vw, 62px);
      border-bottom: 1px solid var(--line);
    }

    .breadcrumb { display: flex; align-items: center; gap: 10px; font-size: 12px; }
    .muted { color: var(--subtle); }
    .breadcrumb-separator { color: #4e4e5e; }
    .breadcrumb strong { font-weight: 600; }

    .topbar-actions { display: flex; align-items: center; gap: 13px; }
    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      width: min(260px, 24vw);
      padding: 9px 11px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: rgba(255, 255, 255, .025);
    }

    .search-box input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--ink); font-size: 11px; }
    .search-box input::placeholder { color: #6f6f80; }
    .search-icon { position: relative; width: 13px; height: 13px; border: 1.5px solid var(--muted); border-radius: 50%; }
    .search-icon::after { position: absolute; right: -4px; bottom: -2px; width: 5px; height: 1.5px; transform: rotate(45deg); background: var(--muted); content: ''; }
    .search-shortcut { color: #6c6c7a; font-size: 9px; white-space: nowrap; }
    .topbar-icon { position: relative; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; background: transparent; color: var(--muted); font-weight: 600; }
    .topbar-icon:hover { background: rgba(255,255,255,.06); color: var(--ink); }
    .notification-button i { position: absolute; top: 5px; right: 5px; width: 5px; height: 5px; border-radius: 50%; background: #ff8f7d; }
    .bell-icon { width: 12px; height: 13px; border: 1.5px solid currentColor; border-radius: 7px 7px 4px 4px; }
    .topbar-avatar { width: 31px; height: 31px; border-radius: 9px; font-size: 9px; }

    .dashboard-content { width: min(1260px, 100%); padding: 43px clamp(24px, 4vw, 62px) 25px; margin: 0 auto; }
    .welcome-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 31px; }
    .date-kicker { margin-bottom: 9px; color: var(--purple-light); font-size: 11px; font-weight: 600; }
    h1, h2, h3, p { margin: 0; }
    h1 { font: 600 clamp(26px, 3vw, 36px)/1.15 'Space Grotesk', sans-serif; letter-spacing: -1.4px; }
    .wave { color: #f4b06e; font-size: .78em; }
    .welcome-row p { margin-top: 10px; color: var(--muted); font-size: 13px; }
    .primary-button, .secondary-button, .outline-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
    }
    .primary-button { padding: 12px 16px; background: var(--purple); color: white; box-shadow: 0 10px 22px rgba(117, 104, 246, .22); }
    .primary-button:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(117, 104, 246, .32); }
    .plus-symbol { font-size: 18px; font-weight: 400; line-height: 12px; }

    .composer { display: flex; align-items: center; gap: 13px; padding: 13px 15px; margin: -12px 0 25px; border: 1px solid rgba(117,104,246,.36); border-radius: 14px; background: rgba(117,104,246,.09); }
    .composer-input { display: flex; align-items: center; flex: 1; gap: 10px; }
    .composer-check { width: 16px; height: 16px; border: 1px solid var(--purple-light); border-radius: 50%; }
    .composer-input input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--ink); font-size: 13px; }
    .composer-input input::placeholder { color: var(--muted); }
    .composer-hint { color: var(--subtle); font-size: 10px; }
    .composer > button { padding: 8px 13px; border-radius: 8px; background: var(--purple); color: white; font-size: 11px; font-weight: 600; }
    .composer > button:disabled { cursor: not-allowed; opacity: .45; }

    .overview-grid { display: grid; grid-template-columns: 1.15fr .85fr; gap: 18px; margin-bottom: 18px; }
    .focus-card, .week-card, .calendar-strip, .tasks-section { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: 17px; background: var(--panel); }
    .focus-card { min-height: 268px; padding: 24px 26px 21px; background: radial-gradient(circle at 100% 0%, rgba(132, 120, 255, .24), transparent 46%), linear-gradient(130deg, #26233e, #1b1b2b 68%); }
    .focus-orbit { position: absolute; border: 1px solid rgba(164, 156, 255, .11); border-radius: 50%; pointer-events: none; }
    .orbit-one { width: 240px; height: 240px; right: -40px; top: -88px; }
    .orbit-two { width: 180px; height: 180px; right: 13px; top: -60px; }
    .focus-topline, .focus-footer, .section-heading { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; }
    .focus-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 9px; border-radius: 8px; background: rgba(119, 106, 246, .17); color: #bcb5ff; font-size: 10px; font-weight: 600; }
    .focus-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--purple-light); box-shadow: 0 0 0 4px rgba(170,160,255,.09); }
    .card-menu { padding: 5px 0; font-size: 16px; }
    .focus-content { position: relative; z-index: 1; display: flex; align-items: flex-start; gap: 14px; margin: 27px 0 23px; max-width: 410px; }
    .focus-icon { display: grid; flex: 0 0 36px; place-items: center; width: 36px; height: 36px; border: 1px solid rgba(255,255,255,.12); border-radius: 11px; background: rgba(255,255,255,.09); color: #c7c1ff; font-size: 17px; }
    .focus-label { color: var(--muted); font-size: 10px; }
    .focus-content h2 { margin-top: 5px; font: 600 21px/1.2 'Space Grotesk', sans-serif; letter-spacing: -.6px; }
    .focus-content p { max-width: 360px; margin-top: 8px; color: #a4a1b6; font-size: 11px; line-height: 1.55; }
    .focus-progress-row { position: relative; z-index: 1; display: flex; align-items: center; gap: 11px; }
    .progress-track { flex: 1; height: 5px; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,.11); }
    .progress-track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #8d83ff, #c0b9ff); }
    .focus-progress-row strong { color: #d6d2ff; font-size: 11px; }
    .focus-footer { margin-top: 22px; }
    .avatar-stack { display: flex; align-items: center; }
    .mini-avatar { display: grid; place-items: center; width: 23px; height: 23px; margin-left: -5px; border: 2px solid #222033; border-radius: 50%; color: white; font-size: 8px; font-weight: 700; }
    .mini-avatar:first-child { margin-left: 0; }
    .avatar-purple { background: linear-gradient(135deg, #b0a7ff, #6153db); }
    .avatar-orange { background: linear-gradient(135deg, #ffba89, #e8766e); }
    .avatar-blue { background: linear-gradient(135deg, #91d5ef, #4b7ed5); }
    .avatar-extra { display: grid; place-items: center; width: 23px; height: 23px; margin-left: -5px; border: 2px solid #222033; border-radius: 50%; background: #3b394e; color: #e0dded; font-size: 8px; }
    .focus-due { color: #aaa7ba; font-size: 10px; }
    .focus-due span { margin-left: 5px; color: var(--purple-light); font-size: 14px; }

    .week-card { padding: 24px 24px 20px; }
    .section-overline { display: block; margin-bottom: 6px; }
    .section-heading h2, .calendar-copy h2, .tasks-header h2 { font: 600 20px/1.2 'Space Grotesk', sans-serif; letter-spacing: -.6px; }
    .icon-button { padding: 0; font-size: 16px; }
    .week-stats { display: flex; gap: clamp(16px, 3vw, 35px); margin: 23px 0 20px; }
    .week-stats div { display: grid; gap: 3px; }
    .week-stats strong { font: 600 20px/1 'Space Grotesk', sans-serif; }
    .week-stats span { color: var(--subtle); font-size: 9px; white-space: nowrap; }
    .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; height: 74px; padding: 0 5px; border-bottom: 1px solid var(--line); }
    .bar-group { display: grid; justify-items: center; gap: 7px; height: 100%; color: var(--subtle); font-size: 9px; }
    .bar-rail { display: flex; align-items: flex-end; height: 54px; }
    .bar-rail span { width: 9px; min-height: 6px; border-radius: 5px; background: #4a495c; }
    .bar-group--today .bar-rail span { background: linear-gradient(#bcb6ff, #7165f2); box-shadow: 0 4px 12px rgba(117,104,246,.3); }
    .bar-group--today { color: #c6c0ff; font-weight: 600; }

    .calendar-strip { display: flex; align-items: center; gap: 27px; padding: 18px 22px; margin-bottom: 30px; }
    .calendar-copy { flex: 0 0 auto; }
    .calendar-copy h2 { font-size: 16px; }
    .calendar-copy h2 span { color: var(--subtle); font: 400 13px 'DM Sans', sans-serif; }
    .calendar-days { display: flex; justify-content: space-around; flex: 1; gap: 5px; }
    .calendar-day { position: relative; display: grid; place-items: center; gap: 4px; min-width: 35px; padding: 3px 7px 5px; border-radius: 9px; background: transparent; color: var(--subtle); }
    .calendar-day span { font-size: 9px; text-transform: uppercase; }
    .calendar-day strong { color: #e5e3ee; font: 600 13px 'Space Grotesk', sans-serif; }
    .calendar-day--muted { opacity: .45; }
    .calendar-day--selected { background: var(--purple); box-shadow: 0 7px 16px rgba(117,104,246,.25); color: white; }
    .calendar-day--selected strong { color: white; }
    .calendar-day i { position: absolute; bottom: 0; width: 3px; height: 3px; border-radius: 50%; background: #f2b07a; }
    .calendar-day--selected i { background: white; }
    .outline-button { flex: 0 0 auto; padding: 9px 12px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-size: 10px; }
    .outline-button:hover { border-color: rgba(170,160,255,.5); color: var(--ink); }
    .outline-button span { color: var(--purple-light); font-size: 14px; }

    .tasks-section { padding: 25px 25px 8px; background: #171822; }
    .tasks-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
    .view-toggle { display: flex; gap: 4px; padding: 4px; border-radius: 9px; background: #11121b; }
    .view-toggle button { padding: 7px 9px; border-radius: 6px; background: transparent; color: var(--subtle); font-size: 10px; white-space: nowrap; }
    .view-toggle button span { margin-left: 3px; color: #5f5f70; }
    .view-toggle button.active { background: #2b2a3a; color: #d2cdff; box-shadow: 0 2px 7px rgba(0,0,0,.14); }
    .view-toggle button.active span { color: #aaa0ff; }
    .tasks-list { display: grid; }
    .task-row { display: flex; align-items: center; gap: 13px; min-height: 89px; padding: 16px 4px; border-top: 1px solid var(--line); transition: background .2s ease; }
    .task-row:hover { margin: 0 -9px; padding-right: 13px; padding-left: 13px; border-radius: 10px; background: rgba(255,255,255,.025); }
    .task-check { display: grid; flex: 0 0 18px; place-items: center; width: 18px; height: 18px; padding: 0; border: 1px solid #525263; border-radius: 6px; background: transparent; color: white; font-size: 11px; }
    .task-check:hover { border-color: var(--purple-light); }
    .task-check--done { border-color: var(--purple); background: var(--purple); }
    .task-main { flex: 1; min-width: 0; }
    .task-title-line { display: flex; align-items: center; gap: 9px; }
    .task-title-line h3 { overflow: hidden; font-size: 13px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
    .task-row--done h3 { color: var(--muted); text-decoration: line-through; }
    .task-main p { overflow: hidden; margin-top: 5px; color: var(--subtle); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
    .priority { padding: 4px 7px; border-radius: 5px; font-size: 8px; font-weight: 700; text-transform: uppercase; }
    .priority--high { background: rgba(248, 126, 117, .12); color: #fb9a91; }
    .priority--medium { background: rgba(247, 185, 112, .12); color: #f3bd76; }
    .priority--low { background: rgba(112, 214, 165, .11); color: #75d8a9; }
    .task-meta { display: flex; align-items: center; gap: 7px; margin-top: 8px; color: #6e6e7f; font-size: 9px; }
    .task-project { display: inline-flex; align-items: center; gap: 5px; color: #8f8da0; }
    .task-project i { width: 6px; height: 6px; border-radius: 2px; }
    .meta-separator { color: #464655; }
    .task-assignees { display: flex; }
    .task-assignees .mini-avatar { width: 22px; height: 22px; }
    .task-menu { padding: 7px 1px 7px 10px; font-size: 15px; }
    .empty-tasks { display: grid; justify-items: center; padding: 43px 20px; text-align: center; }
    .empty-icon { display: grid; place-items: center; width: 38px; height: 38px; margin-bottom: 12px; border-radius: 12px; background: rgba(117,104,246,.13); color: var(--purple-light); font-size: 19px; }
    .empty-tasks h3 { font-size: 14px; }
    .empty-tasks p { margin-top: 6px; color: var(--subtle); font-size: 11px; }
    .secondary-button { padding: 9px 12px; margin-top: 15px; background: #29283a; color: #c0baff; font-size: 10px; }
    .secondary-button:hover { background: #37354e; }
    .dashboard-footer { display: flex; justify-content: space-between; padding: 24px 3px 0; color: #5e5e6d; font-size: 10px; }
    .footer-links { display: flex; gap: 16px; }
    .footer-links button { padding: 0; background: transparent; color: inherit; font-size: inherit; }
    .footer-links button:hover { color: var(--muted); }

    @media (max-width: 1040px) {
      .sidebar { flex-basis: 220px; width: 220px; }
      .overview-grid { grid-template-columns: 1fr; }
      .week-card { min-height: 220px; }
      .bar-chart { max-width: 420px; }
      .calendar-strip { gap: 15px; }
      .calendar-day { min-width: 27px; padding-right: 4px; padding-left: 4px; }
    }

    @media (max-width: 760px) {
      .sidebar { position: fixed; left: 0; transform: translateX(-100%); transition: transform .25s ease; }
      .sidebar--open { transform: translateX(0); box-shadow: 18px 0 40px rgba(0,0,0,.28); }
      .sidebar-backdrop { position: fixed; inset: 0; display: block; background: rgba(0,0,0,.55); z-index: 19; }
      .mobile-close { display: block; margin-left: auto; background: transparent; color: var(--muted); font-size: 25px; line-height: 1; }
      .mobile-menu { display: grid; gap: 3px; width: 33px; height: 33px; padding: 9px 8px; border-radius: 8px; background: transparent; }
      .mobile-menu span { display: block; height: 1px; background: var(--muted); }
      .topbar { min-height: 68px; padding: 0 20px; }
      .breadcrumb { margin-left: 5px; }
      .topbar-actions { gap: 5px; }
      .search-box { width: 32px; padding: 9px; border: 0; background: transparent; }
      .search-box input, .search-shortcut { display: none; }
      .dashboard-content { padding: 31px 20px 20px; }
      .welcome-row { align-items: flex-start; flex-direction: column; margin-bottom: 24px; }
      .welcome-row .primary-button { width: 100%; }
      .calendar-strip { align-items: flex-start; flex-direction: column; padding: 18px; }
      .calendar-days { width: 100%; }
      .outline-button { align-self: stretch; }
      .tasks-section { padding: 20px 15px 5px; }
      .tasks-header { align-items: flex-start; flex-direction: column; }
      .view-toggle { width: 100%; }
      .view-toggle button { flex: 1; padding-right: 5px; padding-left: 5px; }
      .task-assignees { display: none; }
      .task-menu { padding-left: 3px; }
    }

    @media (max-width: 430px) {
      .topbar .topbar-icon:not(.notification-button), .topbar-avatar { display: none; }
      .search-box { margin-left: auto; }
      .focus-card, .week-card { padding-right: 18px; padding-left: 18px; }
      .focus-content h2 { font-size: 18px; }
      .calendar-day:nth-child(-n+2), .calendar-day:nth-last-child(-n+2) { display: none; }
      .task-title-line { align-items: flex-start; flex-direction: column; gap: 5px; }
      .task-row { align-items: flex-start; }
      .task-check { margin-top: 2px; }
      .dashboard-footer { align-items: flex-start; flex-direction: column; gap: 12px; }
    }
  `]
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
      const matchesSearch = !query || todo.title.toLowerCase().includes(query) || (todo.description || '').toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  });

  activeCount = computed(() => this.todos().filter(todo => !todo.completed).length);
  completedCount = computed(() => this.todos().filter(todo => todo.completed).length);
  progress = computed(() => {
    const total = this.todos().length;
    return total ? Math.round((this.completedCount() / total) * 100) : 0;
  });

  todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
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
    this.calendarDays.forEach(day => day.selected = day.number === number);
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
    return Number.isNaN(date.valueOf()) ? 'No date' : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }

  categoryColor(todo: Todo): string {
    return todo.category?.color || '#8b80ff';
  }
}