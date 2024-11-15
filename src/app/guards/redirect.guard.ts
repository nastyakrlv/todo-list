import { Router } from '@angular/router';
import { AuthService } from '../services';
import { inject } from '@angular/core';

export const redirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.isLoggedIn();
  
  if (user) {
    router.navigate(['/workplace']);
  } else {
    router.navigate(['/auth']);
  }
  
  return false;
};
