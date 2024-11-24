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

/**
 * @class InterceptorService
 * @description This service is responsible for intercepting HTTP requests and handling unauthorized errors by refreshing the token.
 *
 * @providedIn 'root'
 *
 * @property {boolean} isRefreshing - Flag indicating if the token is being refreshed.
 * @property {Observable<any> | null} refreshTokenSubject - Observable for the refresh token.
 *
 * @constructor
 * @param {HttpClient} httpClient - The Angular HTTP client for making HTTP requests.
 * @param {Router} router - The Angular Router service for navigation.
 *
 * @method intercept - Intercepts HTTP requests and handles unauthorized errors.
 * @param {HttpRequest<any>} request - The HTTP request to be intercepted.
 * @param {HttpHandler} next - The HTTP handler to handle the request.
 * @returns {Observable<HttpEvent<any>>} - Returns an observable of the HTTP event.
 * @method handleUnauthorizedError - Handles unauthorized errors by refreshing the token.
 * @param {HttpRequest<any>} request - The HTTP request to be handled.
 * @param {HttpHandler} next - The HTTP handler to handle the request.
 * @returns {Observable<HttpEvent<any>>} - Returns an observable of the HTTP event.
 * @method refreshToken - Refreshes the token by making an HTTP request to the refresh token endpoint.
 * @returns {Observable<any>} - Returns an observable of the refresh token response.
 */
@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private isRefreshing: boolean;
  private refreshTokenSubject: Observable<any> | null;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.isRefreshing = false;
    this.refreshTokenSubject = null;
  }

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = request.clone({ withCredentials: true });
    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401 &&
          !clonedRequest.url.includes('/refresh-token')
        ) {
          return this.handleUnauthorizedError(clonedRequest, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject = this.refreshToken();
      return this.refreshTokenSubject.pipe(
        switchMap(() => {
          this.isRefreshing = false;
          return next.handle(request.clone({ withCredentials: true }));
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.router.navigate(['/unauthorized']);
          return throwError(() => new Error('Unauthorized'));
        })
      );
    } else {
      return this.refreshTokenSubject!;
    }
  }

  private refreshToken(): Observable<any> {
    return this.httpClient.post(
      `${environment.apiUrl}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
  }
}
