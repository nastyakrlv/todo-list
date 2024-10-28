import { Route } from '@angular/router';
import {
  IntroComponent,
  LoginComponent,
  RegistrationComponent,
} from './components';
import { AppComponent } from './app.component';

export const appRoutes: Route[] = [
  { path: '', component: AppComponent },
  { path: 'auth', component: IntroComponent },
  { path: 'auth/register', component: RegistrationComponent },
  { path: 'auth/login', component: LoginComponent },

  //TODO: НИНА добавить authguard к рабочей странице - уже готов
];
