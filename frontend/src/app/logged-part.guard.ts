import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private httpClient: HttpClient) {}

  canActivate(): Observable<boolean> {
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
