import { Route } from '@angular/router';
import {
  IntroComponent,
  LoginComponent,
  RegistrationComponent,
  ProjectPageComponent,
} from './components';
import { AppComponent } from './app.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', component: AppComponent },
  { path: 'auth', component: IntroComponent },
  { path: 'auth/register', component: RegistrationComponent },
  { path: 'auth/login', component: LoginComponent },
  { 
    path: 'projects', 
    component: ProjectsComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'projects/:projectId',
    component: ProjectPageComponent,
    canActivate: [authGuard]
  },
];
