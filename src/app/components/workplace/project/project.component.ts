import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryCardComponent } from './category-card/category-card.component';
import { ProjectsService } from 'src/app/services/projects.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { IProject } from 'src/app/interfaces/project.interface';
import { ProjectSelectComponent } from './project-select/project-select.component';
import { TasksService } from 'src/app/services/tasks.service';
import { ITask } from 'src/app/interfaces/task.interface';
import {
  TuiAutoColorPipe,
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
  TuiIcon,
  TuiInitialsPipe,
  TuiLoader,
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
import { UsersService } from 'src/app/services/users.service';
import { IUserName } from 'src/app/interfaces/user-name.interface';
import { TuiAvatar, TuiAvatarStack } from '@taiga-ui/kit';
import { UsersCardComponent } from './users-card/users-card.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    TuiAutoColorPipe,
    TuiAvatarStack,
    TuiAvatar,
    TuiInitialsPipe,
    UsersCardComponent,
    TuiLoader,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private readonly usersService = inject(UsersService);
  private readonly projectsService = inject(ProjectsService);
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);

  role = '';
  projectId = '';
  project = <IProject>{};
  project$ = new BehaviorSubject(this.project);
  users: IUserName[] = [];
  isAdmin = false;
  isLoading = true;

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.isLoading = true;
        this.projectId = params['projectId'];
        this.loadProject();
      });
  }

  private loadProject(): void {
    this.projectsService
      .getProjectById$(this.projectId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((project) => {
        this.project = project;
        this.role = this.projectsService.getCurrentUserRole(project);
        this.mapUsers();
        this.getCurUserRole();
      });
  }

  private mapUsers(): void {
    const arr: IUserName[] = [];
    this.project.users.forEach((user) => {
      this.usersService.getUserById(user.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((userInfo) => {
          arr.push({
            ...userInfo,
            role: user.role,
          });
          this.users = [...arr];
          this.changeDetectorRef.detectChanges();
        });
    });
  }

  private getCurUserRole(): void {
    this.isAdmin = this.usersService.curUserIsAdmin(this.project);
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
      .pipe(takeUntilDestroyed(this.destroyRef))
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  onAddTask(event: ICreateTask, categoryId: string) {
    this.projectsService
      .createNewTask(this.project, categoryId, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  onDeleteTask(event: string) {
    this.projectsService
      .removeTask(this.project, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  onEditTask(event: ITask) {
    this.projectsService.editTask(this.project, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.changeDetectorRef.detectChanges();
      });
  }

  addUser(event: string) {
    this.projectsService.addUser(this.project, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.mapUsers();
        this.changeDetectorRef.detectChanges();
      });
  }

  deleteUser(event: string) {
    this.projectsService
      .deleteUser(this.project, event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((project) => {
        this.project = project;
        this.mapUsers();
        this.changeDetectorRef.detectChanges();
      });
  }

  onDeleteProject() {
    this.projectsService
      .deleteProjectById(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['workplace/projects']));
  }
}
