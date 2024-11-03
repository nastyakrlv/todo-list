import { Route } from '@angular/router';
import {
  IntroComponent,
  LoginComponent,
  RegistrationComponent,
  ProjectPageComponent,
  WorkplaceComponent,
  ProfileComponent,
} from './components';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { workplaceGuard } from './guards/workplace.guard';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', component: AppComponent },
  { path: 'auth', component: IntroComponent, canActivate: [authGuard] },
  { path: 'auth/register', component: RegistrationComponent, canActivate: [authGuard] },
  { path: 'auth/login', component: LoginComponent, canActivate: [authGuard] },
  { 
    path: 'projects/:projectId',
    component: ProjectPageComponent,
    canActivate: [workplaceGuard]
  },
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
        component: ProjectsComponent, 
      },
    ]
  },
];
