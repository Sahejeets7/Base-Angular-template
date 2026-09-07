import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop'; // For clean API mapping

// Interface defining the structural data type
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// 1. SERVICE WITH HTTP CLIENT
class TaskService {
  // Injecting modern HttpClient natively
  private http = inject(HttpClient);
  private apiUrl = 'https://typicode.com';

  // Returns an Observable stream of data
  getTasksFromApi() {
    return this.http.get<Task[]>(this.apiUrl);
  }
}

// 2. COMPONENT
@Component({
  selector: 'app-root',
  standalone: true,
  providers: [TaskService],
  template: `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>API Task Manager</h1>

      <!-- Handling API Loading and Errors using Control Flow -->
      @if (loading()) {
        <p>⏳ Fetching items from the database...</p>
      }

      @if (errorMessage()) {
        <p style="color: red;">❌ Error: {{ errorMessage() }}</p>
      }

      <!-- Iterating through the active Signal list -->
      <ul>
        @for (task of tasks(); track task.id) {
          <li>
            <input type="checkbox" [checked]="task.completed" />
            {{ task.title }}
          </li>
        }
      </ul>

      <p>Total Fetched: <strong>{{ totalTasks() }}</strong></p>
    </div>
  `
})
export class App implements OnInit {
  private taskService = inject(TaskService);

  // Defining internal state utilizing Signals
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Derived signal updates automatically when tasks update
  totalTasks = computed(() => this.tasks().length);

  ngOnInit() {
    this.loading.set(true);

    // 3. SUBSCRIBING TO THE HTTP STREAM 
    this.taskService.getTasksFromApi().subscribe({
      next: (data) => {
        this.tasks.set(data); // Converting stream output cleanly into state Signal
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Something went wrong');
        this.loading.set(false);
      }
    });
  }
}

// 4. BOOTSTRAPPING (Passing the global HTTP Provider)
bootstrapApplication(App, {
  providers: [
    provideHttpClient() // Enabler for global HTTP injections
  ]
}).catch(err => console.error(err));
