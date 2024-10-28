import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() === false) {
    // router.navigate(['/project']); //TODO: НИНА сделать перенаправление на рабочую страницу
    return false;
  }

  return authService.isLoggedIn();
};
