import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  projectId = '';

  ngOnInit() {
    this.activatedRoute.params
        .subscribe((params) => {
          this.projectId = params['projectId'];
        })
  }

}
