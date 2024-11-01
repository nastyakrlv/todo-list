import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { TuiChevron } from '@taiga-ui/kit';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { ProjectsService } from '../../../services/projects.service';
import { take } from 'rxjs';
import { IProject } from '../../../interfaces/project.interface';

@Component({
  selector: 'app-project-select',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
    RouterLink,
    RouterLinkActive,
    TuiButton,
    TuiChevron,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
  ],
  templateUrl: './project-select.component.html',
  styleUrl: './project-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSelectComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);

  @Input() currentProjectName = '';

  protected open = false;
  protected projects: IProject[] = [];

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsService.projects$.pipe(take(1)).subscribe((projects) => {
      this.projects = projects;
    });
  }
}
