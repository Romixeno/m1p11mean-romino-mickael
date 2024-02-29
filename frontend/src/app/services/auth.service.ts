import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { userType } from '../Models/userType.type';
import { httpUrl } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  private userTypeSubject = new BehaviorSubject<userType>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userType$ = this.userTypeSubject.asObservable();

  constructor() {
    this.isAuthenticated();
  }

  getUser() {
    const userData = sessionStorage.getItem('User');
    if (!userData) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  setUserType(userType: userType) {
    this.userTypeSubject.next(userType);
  }

  setUser(user: any) {
    sessionStorage.setItem('User', JSON.stringify(user));
  }

  deleteUser() {
    sessionStorage.removeItem('User');
    this.isAuthenticated();
  }
  // ---------------------------------------------------------------------------------------
  getUserType() {
    return this.userTypeSubject.getValue();
  }

  // -------------------------------- Client auth ------------------------------------------
  loginUser(body: { email: string; password: string }) {
    return this.http
      .post(`${httpUrl}/client/login`, body, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const user = response.user;
          const { _id, image, userType, ...other } = user;

          this.setUser({
            _id: _id,
            image: image,
            userType: userType,
          });
          this.isAuthenticated();
        })
      );
  }
  logoutUser() {
    return this.http
      .delete(`${httpUrl}/client/logout`, { withCredentials: true })
      .pipe(tap(() => this.deleteUser()));
  }
  signUpUser(body: any) {
    return this.http.post(`${httpUrl}/client/register`, body);
  }
  // ---------------------------- Client auth end here --------------------------------------
  // -------------------------------Employee auth ---------------------------------------------

  loginEmployee(body: { email: string; password: string }) {
    return this.http
      .post(`${httpUrl}/login/employee`, body, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const employee = response;
          const { _id, image, userType, ...other } = employee;
          this.setUser({
            _id: _id,
            image: image,
            userType: userType,
          });
          this.isAuthenticated();
        })
      );
  }
  logoutEmployee() {
    return this.http
      .delete(`${httpUrl}/employee/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.deleteUser();
        })
      );
  }

  // ---------------------------- Employee auth end here -------------------------------------

  // ------------------------------------ Employee auth -----------------------------------------
  loginManager(body: { email: string; password: string }) {
    return this.http
      .post(`${httpUrl}/manager/login`, body, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const manager = response;
          const { _id, image, userType, ...other } = manager;
          this.setUser({ _id: _id, image: image, userType: userType });
          this.isAuthenticated();
        })
      );
  }
  logoutManager() {
    return this.http
      .delete(`${httpUrl}/manager/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.deleteUser();
        })
      );
  }

  // --------------------------- Manager auth end here ----------------------------------------
  isAuthenticated(): void {
    const user = this.getUser();

    const isAuthenticated = !!user;
    if (!isAuthenticated) {
      this.isLoggedInSubject.next(false);
      this.userTypeSubject.next(null);
      return;
    }
    const userType = user.userType;
    if (
      userType !== 'Client' &&
      userType !== 'Employee' &&
      userType !== 'Manager'
    ) {
      console.error('Invalid userType detected:', userType);
      sessionStorage.removeItem('User');
      this.isLoggedInSubject.next(false);
      this.userTypeSubject.next(null);
      return;
    }

    this.isLoggedInSubject.next(true);
    if (user.userType) {
      this.userTypeSubject.next(user.userType);
    } else {
      this.userTypeSubject.next(null);
    }
  }
}
