import { Route } from '@angular/router';
import {
  IntroComponent,
  LoginComponent,
  RegistrationComponent,
  ProjectPageComponent,
} from './components';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
  { path: '', component: AppComponent },
  { path: 'auth', component: IntroComponent },
  { path: 'auth/register', component: RegistrationComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'project/:projectId', component: ProjectPageComponent },

  //TODO: НИНА добавить authguard к рабочей странице - уже готов
];
