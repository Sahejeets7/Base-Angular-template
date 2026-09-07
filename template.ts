import { Component, signal, computed } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// 1. SERVICE (Dependency Injection)
// Handles the business logic and data fetching simulation
class TaskService {
  private mockTasks = ['Learn Angular Signals', 'Master the 80/20 Features', 'Build a Great App'];

  getTasks(): string[] {
    return this.mockTasks;
  }
}

// 2. STANDALONE COMPONENT
@Component({
  selector: 'app-root',
  standalone: true, // Modern Angular standard
  providers: [TaskService], // Providing the service to the component tree
  styles: `
    .container { font-family: sans-serif; padding: 20px; max-width: 400px; }
    .completed { text-decoration: line-through; color: #888; }
    button { margin-left: 10px; cursor: pointer; }
    input { padding: 5px; }
  `,
  template: `
    <div class="container">
      <!-- Data Binding: Interpolation -->
      <h1>{{ title }}</h1>

      <!-- Control Flow: Conditional display -->
      @if (taskCount() === 0) {
        <p>🎉 All done! No tasks left.</p>
      } @else {
        <!-- Data Binding: Property binding [textContent] -->
        <p [textContent]="'Pending tasks: ' + taskCount()"></p>
      }

      <!-- Control Flow: Loop -->
      <ul>
        @for (task of tasks(); track task) {
          <li>
            {{ task }}
            <!-- Data Binding: Event binding (click) -->
            <button (click)="removeTask(task)">❌</button>
          </li>
        }
      </ul>

      <!-- Data Binding: Template reference variable (#newTask) -->
      <input #newTask type="text" placeholder="Add a new task..." />
      <button (click)="addTask(newTask.value); newTask.value = ''">Add</button>
    </div>
  `
})
export class App {
  title = 'My 80/20 Angular App';

  // 3. SIGNALS (Modern Reactivity)
  tasks = signal<string[]>([]);
  
  // Computed signal: Updates automatically when `tasks` changes
  taskCount = computed(() => this.tasks().length);

  // 4. DEPENDENCY INJECTION
  // Injecting the service via the constructor
  constructor(private taskService: TaskService) {
    // Initializing state with service data
    this.tasks.set(this.taskService.getTasks());
  }

  addTask(newTask: string) {
    if (!newTask.trim()) return;
    // Updating the signal state cleanly
    this.tasks.update(currentTasks => [...currentTasks, newTask.trim()]);
  }

  removeTask(taskToRemove: string) {
    this.tasks.update(currentTasks => 
      currentTasks.filter(task => task !== taskToRemove)
    );
  }
}

// 5. BOOTSTRAPPING THE APPLICATION
bootstrapApplication(App);
