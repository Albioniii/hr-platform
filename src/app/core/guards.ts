import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Guards vendosin nëse një faqe mund të hapet.

/** Vetëm përdoruesit e kyçur. Përndryshe → /login */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.currentUser() ? true : inject(Router).createUrlTree(['/login']);
};

/** Vetëm menaxherët. Përndryshe → /dashboard */
export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isManager() ? true : inject(Router).createUrlTree(['/dashboard']);
};

/** Faqja e login-it: nëse je i kyçur tashmë, të dërgon te dashboard. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.currentUser() ? inject(Router).createUrlTree(['/dashboard']) : true;
};
