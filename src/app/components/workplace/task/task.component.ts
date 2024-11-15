import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService, TasksService } from 'src/app/services';
import { BehaviorSubject } from 'rxjs';
import { ICategory, IProject, ITask } from 'src/app/interfaces';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiLoader } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskComponent } from '../project/task/task.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, TuiBadge, TuiLoader, TaskComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent {
  projectId = '';
  taskId = '';
  project$ = new BehaviorSubject<IProject | null>(null);
  task$ = new BehaviorSubject<ITask | undefined>(undefined);
  category$ = new BehaviorSubject<ICategory | undefined>(undefined);
  isLoading$ = new BehaviorSubject<boolean>(true);
  isAdmin = false;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private readonly usersService = inject(UsersService);
  private router = inject(Router);

  constructor() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.projectId = params['projectId'];
        this.taskId = params['taskId'];
        this.loadProject();
      });
  }

  onDeleteTask(event: string) {
    const project = this.project$.getValue();
    if (project) {
      this.projectsService.removeTask(project, event).subscribe(() => {
        this.router.navigate(['..']);
      });
    }
  }

  onEditTask(event: ITask) {
    const project = this.project$.getValue();
    if (project) {
      this.projectsService.editTask(project, event).subscribe((project) => {
        this.project$.next(project);
      });
    }
  }

  private loadProject(): void {
    this.projectsService
      .getProjectById$(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project$.next(project);
        this.getCurUserRole();
        const task = this.tasksService.getTask(project.tasks, this.taskId);
        this.task$.next(task);
        this.category$.next(project.categories.find((category: ICategory) => category.id === task?.categoryId));
        this.isLoading$.next(!task);
      });
  }

  private getCurUserRole(): void {
    const project = this.project$.getValue();
    if (project) {
      this.isAdmin = this.usersService.curUserIsAdmin(project);
    }
  }
}
