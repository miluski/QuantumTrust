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
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../environments/environment.development';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  private isRefreshing: boolean;
  private refreshTokenSubject: BehaviorSubject<any>;

  constructor(private router: Router, private httpClient: HttpClient) {
    this.isRefreshing = false;
    this.refreshTokenSubject = new BehaviorSubject<any>(null);
  }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({
      withCredentials: true,
    });
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handleUnauthorizedError(clonedRequest, next);
        } else {
          if (
            (error.status === 403 || error.status === 500) &&
            this.router.url === '/main-page'
          ) {
            this.router.navigate(['/unauthorized']);
          }
          return throwError(() => error);
        }
      })
    );
  }

  private handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.httpClient
        .post(
          `${environment.apiUrl}/auth/refresh-token`,
          {},
          { withCredentials: true }
        )
        .pipe(
          tap(() => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(true);
          }),
          switchMap(() => {
            return next.handle(request);
          }),
          catchError((error: HttpErrorResponse) => {
            this.isRefreshing = false;
            if (
              (error.status === 403 || error.status === 500) &&
              this.router.url === '/main-page'
            ) {
              this.router.navigate(['/unauthorized']);
            }
            return throwError(() => error);
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap(() => {
          return next.handle(request);
        }),
        catchError((error: HttpErrorResponse) => {
          this.isRefreshing = false;
          if (
            (error.status === 403 || error.status === 500) &&
            this.router.url === '/main-page'
          ) {
            this.router.navigate(['/unauthorized']);
          }
          return throwError(() => error);
        })
      );
    }
  }
}
