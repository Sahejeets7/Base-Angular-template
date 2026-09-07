To connect this setup to a real backend API, you switch from hardcoded arrays to Angular’s modern HttpClient combined with Signals. [1, 2] 
Because modern Angular uses functional approach, we must use provideHttpClient() inside our application configuration rather than old legacy modules. [3] 
## 🌐 The API-Connected Code Template
Here is how you structure the code to cleanly fetch data from a backend REST API (such as [JSONPlaceholder](https://jsonplaceholder.typicode.com/)) and manage it using Signals: [1, 3, 4] 

import { Component, signal, computed, inject, OnInit } from '@angular/core';import { bootstrapApplication } from '@angular/platform-browser';import { HttpClient, provideHttpClient } from '@angular/common/http';import { rxResource } from '@angular/core/rxjs-interop'; // For clean API mapping
// Interface defining the structural data typeinterface Task {
  id: number;
  title: string;
  completed: boolean;
}
// 1. SERVICE WITH HTTP CLIENTclass TaskService {
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
})export class App implements OnInit {
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

------------------------------
## 🧠 The Core Rules of Angular API Calls

   1. Keep UI Thin, Services Heavy: Components never call APIs directly. The Component simply asks the Service for data and translates the result into a local signal. [1, 2] 
   2. Convert Streams to State: Angular's HttpClient relies on RxJS Observables. To remain in the 80/20 zone, quickly bridge the asynchronous stream over into a regular synchronous signal inside the .subscribe() wrapper block. [1, 2, 4] 
   3. Always Register the Provider: If you forget to specify provideHttpClient() in the root setup configuration, your app will trigger a terminal NullInjectorError crash. [5] 

Would you like to explore:

* 
* How to send a POST request to add a task to the server
* How to use Angular's advanced rxResource utility to fetch APIs without using manual subscriptions
* 


[1] [https://www.youtube.com](https://www.youtube.com/watch?v=yMkUuMPUzs0&t=149)
[2] [https://nareshit.com](https://nareshit.com/blogs/api-integration-in-angular-17-guide)
[3] [https://www.youtube.com](https://www.youtube.com/watch?v=_PXwI8ogKCs)
[4] [https://www.youtube.com](https://www.youtube.com/watch?v=FTEo---NobQ)
[5] [https://www.youtube.com](https://www.youtube.com/watch?v=ZmH3DKkahLE&t=2)
