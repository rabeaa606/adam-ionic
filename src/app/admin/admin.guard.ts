import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators'; import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsِAdmin.pipe(
      take(1),
      switchMap(isِAdmin => {
        if (isِAdmin) {
          return this.authService.autoLogin();
        } else {
          return of(isِAdmin);
        }
      }),
      tap(isِAdmin => {
        if (!isِAdmin) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
