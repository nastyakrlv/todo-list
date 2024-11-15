import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICategory, ITask } from 'src/app/interfaces';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiIcon,
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
  TuiDataList,
} from '@taiga-ui/core';
import { TuiBadge, TuiDataListWrapper } from '@taiga-ui/kit';
import {
  TuiInputModule,
  TuiInputDateModule,
  TuiTextfieldControllerModule,
  TuiSelectModule,
} from '@taiga-ui/legacy';
import { type PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiDay } from '@taiga-ui/cdk';
import { ProjectsService } from 'src/app/services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    TuiBadge,
    TuiIcon,
    TuiButton,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TuiDataList,
    TuiDataListWrapper,
    TuiSelectModule,
    RouterLink,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnInit, OnChanges {
  @Input() task: ITask = <ITask>{};
  @Input() categoryName = '';
  @Input() projectId = '';
  @Input() isAdmin = false;
  @Input() routeClick = true;

  @Output() editTask = new EventEmitter<ITask>();
  @Output() deleteTask = new EventEmitter<string>();

  protected status = ['Сделано', 'Не сделано'];

  private readonly projectsService = inject(ProjectsService);

  protected categories: ICategory[] = [];

  ngOnInit(): void {
    this.getCategoriesList();
    this.setFormValues();
  }

  ngOnChanges(): void {
    this.setFormValues();
  }

  getCategoriesList() {
    this.projectsService
      .getCategoriesByProjectId(this.projectId)
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  onDeleteTaskClick() {
    this.deleteTask.emit();
  }

  editTaskForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl(TuiDay.currentLocal(), Validators.required),
    badge: new FormControl<string>('', Validators.required),
    category: new FormControl<string>('', Validators.required),
  });

  setFormValues() {
    this.editTaskForm.setValue({
      name: this.task.name,
      description: this.task.description,
      badge: this.task.badge,
      date: TuiDay.normalizeParse(this.task.date, 'YMD'),
      category: this.categoryName,
    });
  }

  onEditTask() {
    if (this.editTaskForm.invalid) {
      return;
    }

    const taskData: ITask = {
      ...this.task,
      name: this.editTaskForm.get('name')?.value,
      description: this.editTaskForm.get('description')?.value,
      date: this.editTaskForm.get('date')?.value.toJSON(),
      badge: this.editTaskForm.get('badge')?.value,
      categoryId:
        this.categories.find(
          (category) =>
            category.name === this.editTaskForm.get('category')?.value
        )?.id || this.task.categoryId,
    };

    this.editTaskForm.reset();

    this.editTask.emit(taskData);
  }

  private readonly dialogs = inject(TuiDialogService);

  protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }
}
