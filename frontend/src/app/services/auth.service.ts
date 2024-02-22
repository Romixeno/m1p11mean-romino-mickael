import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { userType } from '../Models/userType.type';
import { EmployeeModel } from '../Models/employee.model';

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

  // setAuth(value: boolean) {
  //   this.isLoggedInSubject.next(value);
  // }
  getUser() {
    const userData = sessionStorage.getItem('User');
    if (!userData) {
      // If no user data found, return null
      return null;
    }

    try {
      // Attempt to parse the user data
      return JSON.parse(userData);
    } catch (error) {
      // If parsing fails, log the error and return null
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
      .post('http://localhost:3001/user/login', body, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const user = response.user;
          const { password, __v, ...other } = user;
          this.setUser(other); // Call setUser method after successful login
          this.isAuthenticated(); // Update authentication status
        })
      );
  }
  logoutUser() {
    return this.http
      .delete('http://localhost:3001/logout', { withCredentials: true })
      .pipe(tap(() => this.deleteUser()));
  }
  signUpUser(body: any) {
    return this.http.post('http://localhost:3001/user/register', body);
  }
  // ---------------------------- Client auth end here --------------------------------------
  // -------------------------------Employee auth ---------------------------------------------

  loginEmployee(formData: FormData) {
    return this.http
      .post(`http://localhost:3001/login/employee`, formData, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const employee = response;
          const { password, __v, ...other } = employee;
          this.setUser(other);
          this.isAuthenticated();
        })
      );
  }
  logoutEmployee() {
    return this.http
      .delete(`http://localhost:3001/employee/logout`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.deleteUser();
        })
      );
  }

  // ---------------------------- Employee auth end here -------------------------------------
  isAuthenticated(): void {
    const user = this.getUser();

    const isAuthenticated = !!user;
    if (!isAuthenticated) {
      // Perform actions when the user is not authenticated
      // For example, log out the user or redirect to the login page
      this.isLoggedInSubject.next(false); // Ensure the isLoggedInSubject reflects the current state
      this.userTypeSubject.next(null); // Clear userTypeSubject
      return; // Exit the method
    }

    // User is authenticated
    this.isLoggedInSubject.next(true);
    if (user.userType) {
      this.userTypeSubject.next(user.userType);
    } else {
      this.userTypeSubject.next(null);
    }
  }
}
