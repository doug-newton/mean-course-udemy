import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { tap } from "rxjs";
import { AuthService } from "./auth.service";

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService)
    const router = inject(Router)
    return authService.authStatus$.pipe(tap(status => {
        if (!status) {
            router.navigate(['/auth/login'])
        }
    }))
}