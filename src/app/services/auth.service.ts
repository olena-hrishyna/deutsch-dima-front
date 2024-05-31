import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { IAuthData, IDeleteResponce, IUser } from '../shared/interfaces';
import { TOKEN_KEY, USER_KEY } from '../shared/constants';
import {
  deleteLocalStorage,
  getLocalStorage,
  saveLocalStorage,
} from '../shared/handlers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly urlAuth = 'auth';
  private readonly registerUrl = `${this.urlAuth}/registr`;
  private readonly loginUrl = `${this.urlAuth}/login`;
  private readonly visitUrl = `${this.urlAuth}/visit`;

  currentUser = new BehaviorSubject<IUser | null>(null);
  currentToken = new BehaviorSubject<string>('');

  constructor(private apiService: ApiService, private router: Router) {}

  saveUserData({ token, user }: IAuthData): void {
    saveLocalStorage(TOKEN_KEY, token);
    saveLocalStorage(USER_KEY, user);
  }

  setUserData({ token, user }: IAuthData): void {
    this.currentToken.next(token);
    this.currentUser.next(user);
  }

  deleteUserData(redirectTo?: string): void {
    deleteLocalStorage(TOKEN_KEY);
    deleteLocalStorage(USER_KEY);
    this.currentUser.next(null);
    this.currentToken.next('');

    if (redirectTo) {
      this.redirect(redirectTo);
    }
  }

  redirect(redirectTo?: string, params?: any): void {
    this.router.navigate(
      [redirectTo || '/welcome'],
      params && { queryParams: params }
    );
  }

  login(user: Partial<IUser>): Observable<IAuthData> {
    return this.apiService.postRequest(this.loginUrl, user);
  }

  registration(newUser: IUser): Observable<IAuthData> {
    return this.apiService.postRequest(this.registerUrl, newUser);
  }

  deleteMyAccount(): Observable<IDeleteResponce> {
    return this.apiService.deleteRequest(this.urlAuth);
  }

  updateMyAccount(params: Partial<IUser>): Observable<IAuthData> {
    return this.apiService.patchRequest(this.urlAuth, params);
  }

  getCurrentUser(): Observable<IUser | null> {
    return this.currentUser.asObservable();
  }

  getUserData(): IAuthData {
    const token = this.currentToken.getValue();
    const user = this.currentUser.getValue();

    return { token, user } as IAuthData;
  }

  isSuperAdmin(): boolean {
    return !!this.currentUser.getValue()?.isSuperAdmin;
  }

  isAdmin(): boolean {
    return !!this.currentUser.getValue()?.isAdmin;
  }

  checkUserData(): void {
    const token = getLocalStorage(TOKEN_KEY);
    const user = getLocalStorage(USER_KEY);

    if (token && user) {
      this.setUserData({ token, user });
      this.recordLastVisit().subscribe();
    }
  }

  recordLastVisit(): Observable<boolean> {
    return this.apiService.postRequest(this.visitUrl);
  }
}
