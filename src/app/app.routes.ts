import { Route } from '@angular/router';
import {
  IntroComponent,
  LoginComponent,
  RegistrationComponent,
  ProjectComponent,
  WorkplaceComponent,
  ProfileComponent,
  TaskDetailsComponent,
  SharedProjectsComponent,
  PersonalProjectsComponent,
} from './components';
import { AppComponent } from './app.component';
import { workplaceGuard } from './guards/workplace.guard';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: AppComponent },
  { path: 'auth', component: IntroComponent, canActivate: [authGuard] },
  {
    path: 'auth/register',
    component: RegistrationComponent,
    canActivate: [authGuard],
  },
  { path: 'auth/login', component: LoginComponent, canActivate: [authGuard] },
  {
    path: 'workplace',
    component: WorkplaceComponent,
    canActivate: [workplaceGuard],
    canActivateChild: [workplaceGuard],
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'projects',
        component: PersonalProjectsComponent,
      },
      {
        path: 'projects/:projectId',
        component: ProjectComponent,
      },
      {
        path: 'projects/:projectId/:taskId',
        component: TaskDetailsComponent,
      },
      {
        path: 'shared',
        component: SharedProjectsComponent,
      },
      {
        path: 'shared/:projectId',
        component: ProjectComponent,
      },
      {
        path: 'shared/:projectId/:taskId',
        component: TaskDetailsComponent,
      },
    ],
  },
];
