import { Injectable } from '@angular/core';
import { ITask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  getTasksByCategoryId(tasks: ITask[], categoryId: string): ITask[] {
    return tasks.filter((task) => task.categoryId === categoryId);
  }
}
