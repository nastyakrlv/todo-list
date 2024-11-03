import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TuiNavigation} from '@taiga-ui/layout';
import { TuiIcon } from '@taiga-ui/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-workplace',
  standalone: true,
  imports: [CommonModule, TuiNavigation, TuiIcon, RouterOutlet, RouterLink,
  ],
  templateUrl: './workplace.component.html',
  styleUrl: './workplace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkplaceComponent {
  protected expanded = false;

}
