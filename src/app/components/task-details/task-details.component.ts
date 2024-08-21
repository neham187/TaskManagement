import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../model/task-data';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css'
})
export class TaskDetailsComponent {
  @Input() task!: Task;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  @Output() delete: EventEmitter<string> = new EventEmitter<string>();
constructor(private _router: Router){

}
  toggleCompletion(): void {
    this.toggle.emit(this.task.id);
  }

  editTask(id:string) {
    console.log('i am called****************',id)
    this._router.navigate([`/edit-task/${id}`]);
  }

  deleteTask(): void {
    this.delete.emit(this.task.id);
  }
}
