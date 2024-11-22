import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private next!: HttpHandler;
  private request!: HttpRequest<any>;

  constructor(private httpClient: HttpClient, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.next = next;
    const clonedRequest: HttpRequest<any> = request.clone({
      withCredentials: true,
    });
    if (!clonedRequest.url.includes('/refresh-token')) {
      this.request = clonedRequest;
    }
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        return error.status === 401
          ? this.handleRefreshRequest()
          : throwError(() => error);
      })
    );
  }

  private handleRefreshRequest(): Observable<HttpEvent<any>> {
    return this.httpClient
      .post(
        `${environment.apiUrl}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        switchMap(() => {
          const retryRequest: HttpRequest<any> = this.request.clone({
            withCredentials: true,
          });
          return this.next.handle(retryRequest);
        }),
        catchError(() => {
          this.router.navigate(['/unauthorized']);
          return throwError(() => new Error('Unauthorized'));
        })
      );
  }
}
