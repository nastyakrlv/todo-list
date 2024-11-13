import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { TuiChevron } from '@taiga-ui/kit';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { take } from 'rxjs';
import { IProject } from 'src/app/interfaces/project.interface';

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
export class ProjectSelectComponent implements OnChanges {
  private readonly projectsService = inject(ProjectsService);

  @Input() currentProjectName = '';
  @Input() projectType = '';

  protected open = false;
  protected projects: IProject[] = [];

  ngOnChanges() {
    this.loadProjects();
  }

  protected getRouterLink(projectId: string): string {
    return `/workplace/${
      this.projectType === 'shared' ? 'shared' : 'projects'
    }/${projectId}`;
  }

  private loadProjects(): void {
    this.projectsService
      .getProjectsByCurrentUser(this.projectType)
      .pipe(take(1))
      .subscribe((projects) => {
        this.projects = projects;
      });
  }
}
