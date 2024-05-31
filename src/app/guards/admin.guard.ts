import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard {
    constructor(private authService: AuthService, private router: Router) {}

    canLoad(): boolean | Promise<boolean> {
        return this.checkPermissions();
    }

    canActivate(): boolean | Promise<boolean> {
        return this.checkPermissions();
    }

    checkPermissions(): boolean | Promise<boolean> {
      const user = this.authService.getUserData().user
      return (user.isAdmin || user.isSuperAdmin) || this.router.navigate(['/vocabulary-trainer']);
    }
}
