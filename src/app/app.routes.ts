import { Route } from '@angular/router';
import { IntroComponent, RegistrationComponent } from './components';

export const appRoutes: Route[] = [
  { path: 'auth', component: IntroComponent },
  { path: 'auth/register', component: RegistrationComponent },
];
