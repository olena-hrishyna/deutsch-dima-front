import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Promise<boolean> {
    return this.getPermissions();
  }

  canLoad(): boolean | Promise<boolean> {
    return this.getPermissions();
  }

  getPermissions(): boolean | Promise<boolean> {
    return (
      !!this.authService.getUserData().token ||
      this.router.navigate(['/welcome'])
    );
  }
}
