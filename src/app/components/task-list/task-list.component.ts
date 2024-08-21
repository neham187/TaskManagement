import { Component, inject } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Task } from '../../model/task-data';
import { TaskServiceService } from '../../service/task-service.service';
import { TaskDetailsComponent } from "../task-details/task-details.component";
import { Router } from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskDetailsComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  filterStatus = 'all';
  intialTaskList: any[] = [];
  taskList: any[] = [];
  tasks$!: Observable<Task[]>;
  tasks: Task[] = [];
  subscription!: Subscription;
  currentFilter: { status: string; searchTerm: string } = {
    status: 'all',
    searchTerm: '',
  };

  stateService = inject(TaskServiceService);
  constructor(private httpService: TaskServiceService,private _router: Router) {
    this.tasks$ = this.httpService.getTasks();
    this.subscription = this.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.taskList = this.tasks;
    });
  }

 
  ngOnInit() {
    this.httpService.searchSubject.subscribe((value) => {
      console.log("***************************search",value)
      if (value) {
        this.taskList = this.tasks.filter((x) =>
          x.title.toLowerCase().includes(value.toLowerCase()) || x.description.toLowerCase().includes(value.toLowerCase()))
      }else{
        this.taskList=this.tasks;
      }
    });
  }

  onFilterChange(filter: { status: string; searchTerm: string }) {
    this.currentFilter = filter; // Update the current filter state
    this.applyFilter(filter);
  }
 
  applyFilter(filter: { status: string; searchTerm: string }): void {
    this.currentFilter = filter;
    // this.filteredTasks = this.tasks.filter((task) => {
      // const matchesStatus =
      //   filter.status === 'all' ||
      //   (filter.status === 'completed' && task.completed) ||
      //   (filter.status === 'incomplete' && !task.completed);

      // const matchesSearchTerm =
      //   !filter.searchTerm ||
      //   task.title.toLowerCase().includes(filter.searchTerm.toLowerCase());

      // return matchesStatus && matchesSearchTerm;
    // });
  }

 
  deleteTask(id: string): void {
    this.httpService.deleteTask(id);
  }

  toggleTaskCompletion(id: string): void {
    console.log('i am here*******************',id);
    this.httpService.toggleTaskCompletion(id).subscribe(() => {
      this.applyFilter(this.currentFilter); // Apply the filter after toggling task completion
    });
  }

  filterChanged() {
    console.log(this.filterStatus);
    if(this.filterStatus == 'completed') {
      this.taskList = this.tasks.filter((item) =>{
        return item.completed == true
      })
    } else if (this.filterStatus == 'incompleted') {
      this.taskList = this.tasks.filter((item) =>{
        return item.completed == false
      })
    } else {
      this.taskList = this.tasks
    }

  }
  AddTask() {
    this._router.navigateByUrl('/add-task');
  }
}
