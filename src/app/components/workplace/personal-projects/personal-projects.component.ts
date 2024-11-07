import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from '../projects/projects.component';

@Component({
  selector: 'app-personal-projects',
  standalone: true,
  imports: [CommonModule, ProjectsComponent],
  templateUrl: './personal-projects.component.html',
  styleUrl: './personal-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalProjectsComponent {}
