import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskServiceService } from '../../service/task-service.service';
import { Task } from '../../model/task-data';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-add-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.css'
})
export class AddTaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode: boolean = false;
  taskId?: string;
  
  constructor( private _fb: FormBuilder,
    private _httpService: TaskServiceService,
    private _router: Router,
    private _route: ActivatedRoute){
      this.taskForm = this._fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      });
    }

    ngOnInit(): void {
      this._route.paramMap.subscribe((params) => {
        this.taskId = params.get('id') ?? undefined;
        console.log('i am task id', this.taskId);
        if (this.taskId) {
          this.isEditMode = true;
          this._httpService.getTaskById(this.taskId).subscribe((task) => {
            this.taskForm.patchValue({
              title: task.title,
              description: task.description,
            });
          });
        }
      });
    }

    onSubmit(): void {
      if (this.taskForm.valid) {
        const { title, description } = this.taskForm.value;
        if (this.isEditMode && this.taskId) {
          const updatedTask: Task = {
            id: this.taskId,
            title,
            description,
            completed: false,
            important: false
          };
          this._httpService.updateTask(updatedTask).subscribe(() => {
            this._router.navigate(['/']);
          });
        } else {
          this._httpService.addTask({
            id: uuidv4(),
            title,
            description,
            completed: false,
            important: false
          });
          this.taskForm.reset();
          this._router.navigate(['/']);
        }
      }
    }
    onCancel(): void {
      this._router.navigate(['/']);
    }
}


