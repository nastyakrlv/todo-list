import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService, TasksService } from 'src/app/services';
import { take } from 'rxjs';
import { IProject, ITask } from 'src/app/interfaces';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiLoader } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, TuiBadge, TuiLoader],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent implements OnInit {
  projectId = '';
  taskId = '';
  project?: IProject;
  isLoading = true;
  task: ITask | undefined;

  private readonly activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((params) => {
        this.projectId = params['projectId'];
        this.taskId = params['taskId'];
        this.loadProject();
      });
  }

  private loadProject(): void {
    this.projectsService
      .getProjectById$(this.projectId)
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.task = this.tasksService.getTask(this.project.tasks, this.taskId);
        this.isLoading = this.task ? false : true;
        this.changeDetectorRef.detectChanges();
      });
  }
}
