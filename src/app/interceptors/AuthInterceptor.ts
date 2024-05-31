import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { getLocalStorage } from '../shared/handlers';
import { TOKEN_KEY } from '../shared/constants';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = getLocalStorage(TOKEN_KEY);
  const modifiedReq = req.clone({
    headers: req.headers
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`),
  });

  const authService = inject(AuthService);

  return next(modifiedReq).pipe(
    catchError((errorResponse: HttpErrorResponse) => {
      const status = errorResponse.status;
      console.log({ errorResponse, status });

      if (status === 403) {
        authService.deleteUserData('/welcome');
      }

      return throwError(() => errorResponse);
    })
  );
};
