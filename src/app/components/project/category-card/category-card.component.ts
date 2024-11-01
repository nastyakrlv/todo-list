import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiAppearance, TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { ICategory } from 'src/app/interfaces/category.interface';
import { ITask } from 'src/app/interfaces/task.interface';
import { TuiBadge, TuiTiles } from '@taiga-ui/kit';

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
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardComponent {
  @Input() category: ICategory = <ICategory>{};
  @Input() tasks: ITask[] = [];

  protected order = new Map();
}
