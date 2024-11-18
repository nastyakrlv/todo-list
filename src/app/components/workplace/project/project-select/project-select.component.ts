import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { TuiChevron } from '@taiga-ui/kit';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TuiButton, TuiDataList, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { ProjectsService } from 'src/app/services/projects.service';
import { IProject } from 'src/app/interfaces/project.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((projects) => {
        this.projects = projects;
      });
  }
}
