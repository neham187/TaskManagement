import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { TaskServiceService } from '../../service/task-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  stateService = inject(TaskServiceService);
  searchControl = new FormControl('');
  constructor( private _router: Router) {}
  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(250)).subscribe((value) => {
      this.stateService.searchSubject.next(value || '');
    });
  }

  AddTask() {
    this._router.navigateByUrl('/add-task');
  }
}
