import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).getToken();
  const isPublicAuthRequest =
    req.url.includes('/usuario/login') ||
    (req.method === 'POST' && /\/usuario\/?$/.test(req.url));

  if (!token || isPublicAuthRequest || req.headers.has('Authorization')) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
