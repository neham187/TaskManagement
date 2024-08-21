import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,EMPTY,map,Observable, tap} from 'rxjs';
import { Task } from '../model/task-data';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  private apiUrl = 'http://localhost:3008/task';

  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );
  private tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  searchSubject:BehaviorSubject<string>= new BehaviorSubject<string>("");
  constructor(private http: HttpClient) {
    console.log('***************',this.searchSubject);
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<Task[]>(this.apiUrl).subscribe((tasks) => {
      this.tasksSubject.next(tasks);
    });
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Task): void {
    this.http.post<Task>(this.apiUrl, task).subscribe((newTask) => {
      const tasks = this.tasksSubject.value;
      this.tasksSubject.next([...tasks, newTask]);
    });
  }

  updateTask(updatedTask: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.apiUrl}/${updatedTask.id}`, updatedTask)
      .pipe(
        map((task) => {
          const tasks = this.tasksSubject.value.map((t) =>
            t.id === task.id ? task : t
          );
          this.tasksSubject.next(tasks);
          return task;
        })
      );
  }

  deleteTask(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      const tasks = this.tasksSubject.value.filter((t) => t.id !== id);
      this.tasksSubject.next(tasks);
    });
  }

  toggleTaskCompletion(id: string): Observable<Task> {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    const updatedTask = tasks.find((task) => task.id === id);
    if (updatedTask) {
      return this.http
        .put<Task>(`${this.apiUrl}/${updatedTask.id}`, updatedTask)
        .pipe(
          tap((task) => {
            const updatedTasks = this.tasksSubject.value.map((t) =>
              t.id === task.id ? task : t
            );
            this.tasksSubject.next(updatedTasks);
          })
        );
    }
    return EMPTY;
  }
}
