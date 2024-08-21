import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddTaskFormComponent } from './components/add-task-form/add-task-form.component';


export const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent },
    { path: 'add-task', component: AddTaskFormComponent },
    { path: 'edit-task/:id', component: AddTaskFormComponent },
    { path: '**', redirectTo: '' },
  ];