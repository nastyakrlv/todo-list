import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TuiAppearance,
  TuiButton,
  TuiDialogContext,
  TuiDialogService,
  TuiIcon,
  TuiTitle,
} from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ICategory } from 'src/app/interfaces/category.interface';
import { ITask } from 'src/app/interfaces/task.interface';
import { TuiBadge, TuiTiles } from '@taiga-ui/kit';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TuiInputDateModule,
  TuiInputModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/legacy';
import { type PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { TuiDay } from '@taiga-ui/cdk';
import { ICreateTask } from 'src/app/interfaces/create-task.interface';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    CommonModule,
    TuiAppearance,
    TuiCardLarge,
    TuiTitle,
    TuiTiles,
    TuiBadge,
    TuiIcon,
    TuiButton,
    ReactiveFormsModule,
    TuiInputModule,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TaskComponent,
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  @Input() category: ICategory = <ICategory>{};
  @Input() tasks: ITask[] = [];
  @Input() projectId = '';
  @Input() isAdmin = false;

  @Output() deleteCategory = new EventEmitter();
  @Output() addTask = new EventEmitter<ICreateTask>();
  @Output() editTask = new EventEmitter<ITask>();
  @Output() deleteTask = new EventEmitter<string>();

  protected order = new Map();

  onDeleteCategoryClick() {
    this.deleteCategory.emit();
  }

  onAddTaskClick() {
    this.deleteCategory.emit();
  }

  onDeleteTaskClick(taskId: string) {
    this.deleteTask.emit(taskId);
  }

  newTaskForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl(TuiDay.currentLocal(), Validators.required),
  });

  createNewTask() {
    if (this.newTaskForm.invalid) {
      return;
    }

    const taskData: ICreateTask = {
      name: this.newTaskForm.get('name')?.value,
      description: this.newTaskForm.get('description')?.value,
      date: this.newTaskForm.get('date')?.value.toJSON(),
    };

    this.newTaskForm.reset();

    this.addTask.emit(taskData);
  }

  onEditTask(event: ITask) {
    this.editTask.emit(event);
  }

  private readonly dialogs = inject(TuiDialogService);

  protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }
}
