import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from 'src/app/services/projects.service';
import { take } from 'rxjs';
import { IProject } from 'src/app/interfaces/project.interface';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  private changeDetectorRef = inject(ChangeDetectorRef);
  private readonly projectsService = inject(ProjectsService);

  protected projects: IProject[] = [];

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectsService.projects$.pipe(take(1)).subscribe((projects) => {
      this.projects = projects;
      this.changeDetectorRef.detectChanges();
    });
  }
}
