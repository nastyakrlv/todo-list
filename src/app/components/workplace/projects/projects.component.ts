import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProjectsService } from 'src/app/services/projects.service';
import { take } from 'rxjs';
import { IProject } from 'src/app/interfaces/project.interface';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  TuiButton,
  TuiDialogService,
  TuiDialogContext,
  TuiIcon,
} from '@taiga-ui/core';
import { type PolymorpheusContent } from '@taiga-ui/polymorpheus';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    TuiButton,
    TuiIcon,
    ReactiveFormsModule,
    TuiInputModule,
  ],
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
    this.projectsService
      .getPersonalProjectsByCurrentUser()
      .pipe(take(1))
      .subscribe((projects) => {
        this.projects = projects;
        this.changeDetectorRef.detectChanges();
      });
  }

  newProjectForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', Validators.required),
    },
  );

  createNewProject() {
    if (this.newProjectForm.invalid) {
      return;
    }

    const projectData = {
      name: this.newProjectForm.get('name')?.value,
    };

    this.projectsService
      .createNewProject(projectData.name)
      .subscribe((project) => {
        this.projects.push(project);
        this.changeDetectorRef.detectChanges();
      });
  }

  private readonly dialogs = inject(TuiDialogService);

  protected showDialog(content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogs.open(content).subscribe();
  }
}
