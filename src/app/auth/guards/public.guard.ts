import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, GuardResult, MaybeAsync, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate{

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  private checkLogoutStatus(): boolean |Observable<boolean>{
    return this.authService.checkAuthentication().pipe(
      tap( isAuthenticated => console.log('Authenticated: ', isAuthenticated)),
      tap( isAuthenticated => {
        if(isAuthenticated) this.router.navigate(['./']);
        // si tiene token es redireccionado a la pagina de HeroesList
      }),
      map( isAuthenticated => !isAuthenticated),
      // se cambia el isAuthenticated a true porque si no el CanActivate no lo deja pasar
    );
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean|Observable<boolean> {
    return this.checkLogoutStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean|Observable<boolean>{
    return this.checkLogoutStatus();
  }

}
