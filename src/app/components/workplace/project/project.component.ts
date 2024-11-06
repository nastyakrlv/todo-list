import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CategoryCardComponent } from './category-card/category-card.component';
import { ProjectsService } from 'src/app/services/projects.service';
import { BehaviorSubject, take } from 'rxjs';
import { IProject } from 'src/app/interfaces/project.interface';
import { ProjectSelectComponent } from './project-select/project-select.component';
import { TasksService } from 'src/app/services/tasks.service';
import { ITask } from 'src/app/interfaces/task.interface';
import {
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
  TuiIcon,
} from '@taiga-ui/core';
import { type PolymorpheusContent } from '@taiga-ui/polymorpheus';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/legacy';
import { ICreateTask } from 'src/app/interfaces/create-task.interface';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    CategoryCardComponent,
    ProjectSelectComponent,
    TuiIcon,
    TuiButton,
    ReactiveFormsModule,
    TuiInputModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);

  role = '';
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
        this.role = this.projectsService.getCurrentUserRole(project);
        this.project$.next(this.project);
      });
  }

  public getTasksByCategoryId(id: string): ITask[] {
    return this.tasksService.getTasksByCategoryId(this.project.tasks, id);
  }

  newCategoryForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', Validators.required),
    },
    { validators: this.nameMatchValidator.bind(this) }
  );

  createNewCategory() {
    if (this.newCategoryForm.invalid) {
      return;
    }

    const name = this.newCategoryForm.get('name')?.value;

    this.newCategoryForm.reset();

    this.projectsService
      .createNewCategory(this.project, name)
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  private nameMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const name = control.get('name')?.value;

    return this?.project?.categories?.find((category) => category.name === name)
      ? { match: true }
      : null;
  }

  private readonly dialogs = inject(TuiDialogService);

  protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }

  onDeleteCategory(categoryId: string) {
    this.projectsService
      .removeCategory(this.project, categoryId)
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  onAddTask(event: ICreateTask, categoryId: string) {
    this.projectsService
      .createNewTask(this.project, categoryId, event)
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  onDeleteTask(event: string) {
    this.projectsService
      .removeTask(this.project, event)
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  onEditTask(event: ITask) {
    this.projectsService.editTask(this.project, event).subscribe((project) => {
      this.project = project;
      this.changeDetectorRef.detectChanges();
    });
  }
}
