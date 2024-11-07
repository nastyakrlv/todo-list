import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'app-shared-projects',
  standalone: true,
  imports: [CommonModule, ProjectsComponent],
  templateUrl: './shared-projects.component.html',
  styleUrl: './shared-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedProjectsComponent {}
