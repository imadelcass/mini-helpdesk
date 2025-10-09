import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = inject(Auth).getAuthToken();
  const apiUrl = 'http://127.0.0.1:8000/api/';

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    // add base  url
    url: apiUrl + req.url,
    // add bearer token
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(newReq);
};
