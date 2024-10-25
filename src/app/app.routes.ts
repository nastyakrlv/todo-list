import { Route } from '@angular/router';
import {
  IntroComponent,
  RegistrationComponent,
  ProjectPageComponent,
} from './components';

export const appRoutes: Route[] = [
  { path: 'auth', component: IntroComponent },
  { path: 'auth/register', component: RegistrationComponent },
  { path: 'project/:projectId', component: ProjectPageComponent },
];
