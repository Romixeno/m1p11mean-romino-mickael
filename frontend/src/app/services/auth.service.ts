import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../Models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isAuthenticated();
  }

  setUser(user: User) {
    localStorage.setItem('User', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  deleteUser() {
    localStorage.removeItem('User');
    this.isLoggedInSubject.next(false);
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('User'));
  }

  login(body: { email: string; password: string }) {
    return this.http
      .post('http://localhost:3001/user/login', body, {
        withCredentials: true,
      })
      .pipe(tap(() => this.isAuthenticated()));
  }

  signUp(body: any) {
    return this.http.post('http://localhost:3001/user/register', body);
  }

  logout() {
    return this.http
      .delete('http://localhost:3001/logout', { withCredentials: true })
      .pipe(tap(() => this.deleteUser()));
  }

  isAuthenticated(): void {
    const user = this.getUser();
    const isAuthenticated = !!user;
    this.isLoggedInSubject.next(isAuthenticated);
  }
}
