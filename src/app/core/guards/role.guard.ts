import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['roles'] as string[];

    if (!authService.isAuthenticated()) {
        return router.createUrlTree(['/auth/login']);
    }

    const hasRole = authService.hasAnyRole(expectedRoles);

    if (!hasRole) {
        return router.createUrlTree(['/unauthorized']);
    }

    return true;
};
