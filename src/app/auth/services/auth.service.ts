import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor( private http: HttpClient ) { }

  get currentUser(): User|undefined {
    if(!this.user) return undefined;
    // como el ( ...this.user ) pero mejor
    return structuredClone( this.user );
  }

  login( email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`).
    pipe(
      tap( user => { this.user = user; }),
      tap( user => { localStorage.setItem('token', 'JXNSJX6xbbsbx.nxsJ1Xsjx.NXW3NXIJJE'); })
    );
  }

  checkAuthentication(): Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false); // si no tiene token regresa false

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap( user => this.user = user),
      map( user => !!user), // of(true) si tiene token regresa true
      catchError( error => of(false)),
    )
  }

  logout(){
    this.user = undefined;
    localStorage.clear();
  }

}
