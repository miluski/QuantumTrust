import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';

/**
 * @class AuthGuard
 * @description This guard is responsible for protecting routes that require authentication. It checks if the user is authenticated by making an HTTP request to the authentication endpoint.
 *
 * @implements CanActivate
 *
 * @constructor
 * @param {Router} router - The Angular Router service for navigation.
 * @param {HttpClient} httpClient - The Angular HTTP client for making HTTP requests.
 *
 * @method canActivate - Determines if the route can be activated by checking the user's authentication status.
 * @returns {Observable<boolean>} - Returns an observable that emits true if the user is authenticated, otherwise false.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private httpClient: HttpClient) {}

  public canActivate(): Observable<boolean> {
    return this.httpClient
      .get(`${environment.apiUrl}/auth/check`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => response.status === 200),
        catchError(() => {
          this.router.navigate(['/unauthorized']);
          return of(false);
        })
      );
  }
}
