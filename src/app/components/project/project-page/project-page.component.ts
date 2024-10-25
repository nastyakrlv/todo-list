import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { ProjectsService } from '../../../services/projects.service';
import { BehaviorSubject, take } from 'rxjs';
import { IProject } from '../../../interfaces/project.interface';
import { ProjectSelectComponent } from '../project-select/project-select.component';
import { TasksService } from 'src/app/services/tasks.service';
import { ITask } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent, ProjectSelectComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);

  projectId = '';
  project = <IProject>{};
  project$ = new BehaviorSubject(this.project);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['projectId'];
      this.loadProject();
    });
  }

  private loadProject(): void {
    this.projectsService
      .getProjectById$(this.projectId)
      .pipe(take(1))
      .subscribe((project) => {
        this.project = project;
        this.project$.next(this.project);
        console.log(project);
      });
  }

  public getTasksByCategoryId(id: string): ITask[] {
    return this.tasksService.getTasksByCategoryId(this.project.tasks, id);
  }
}
