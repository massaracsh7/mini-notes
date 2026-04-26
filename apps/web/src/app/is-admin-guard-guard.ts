import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isAdminGuard: CanActivateFn = () => {
  const role = localStorage.getItem('role');
  const router = inject(Router);
  return role === 'admin' ? true : router.createUrlTree(['/login']);
};
