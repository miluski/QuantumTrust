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

/**
 * @service InterceptorService
 * @description This service intercepts HTTP requests to handle authentication and authorization errors, including token refresh.
 *
 * @class InterceptorService
 * @implements HttpInterceptor
 *
 * @property {boolean} isRefreshing - Flag indicating if the token is being refreshed.
 * @property {BehaviorSubject<any>} refreshTokenSubject - Subject to handle the refresh token process.
 *
 * @constructor
 * @param {Router} router - The router service for navigation.
 * @param {HttpClient} httpClient - The HTTP client service for making HTTP requests.
 *
 * @method intercept - Intercepts HTTP requests to handle authentication and authorization errors.
 * @param {HttpRequest<any>} request - The HTTP request to be intercepted.
 * @param {HttpHandler} next - The HTTP handler to handle the request.
 * @returns {Observable<HttpEvent<any>>} - Returns an observable of the HTTP event.
 *
 * @method handleUnauthorizedError - Handles unauthorized errors by refreshing the token.
 * @param {HttpRequest<any>} request - The HTTP request that caused the unauthorized error.
 * @param {HttpHandler} next - The HTTP handler to handle the request.
 * @returns {Observable<HttpEvent<any>>} - Returns an observable of the HTTP event.
 */
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
