import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeModel } from '../../../Models/employee.model';
import { EmployeesService } from '../../../services/employees.service';
import { userType } from '../../../Models/userType.type';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { PreferencesModel } from '../../../Models/preferences.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { httpUrl } from '../../../utils/utils';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrl: './staff-detail.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('fav', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class StaffDetailComponent {
  baseUrl: string = httpUrl;
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  employeeService: EmployeesService = inject(EmployeesService);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  employee: EmployeeModel;
  userType: userType;
  preference: PreferencesModel;
  showLoading: boolean = false;
  successMessage: string;
  ngOnInit(): void {
    this.showLoading = true;
    this.userType = this.authService.getUserType();
    if (this.userType == 'Client') {
      const user = this.authService.getUser();
      this.userService.getClientPreferences(user._id).subscribe({
        next: (response: PreferencesModel) => {
          this.preference = response;
          this.showLoading = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    this.activatedRoute.paramMap.subscribe((response) => {
      if (response.get('id')) {
        this.employeeService.getEmployeeById(response.get('id')).subscribe({
          next: (response: EmployeeModel) => {
            this.employee = response;
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    });
  }

  // getAllPreference() {}
  verifyEmployeePreference(employeeId: string) {
    return this.preference.favoriteEmployee.includes(employeeId);
  }

  addRemoveEmployeeFavorite(employeeId: string) {
    this.showLoading = true;
    const user = this.authService.getUser();
    this.userService
      .addRemoveEmployeePreference(user._id, employeeId)
      .subscribe({
        next: (response: PreferencesModel) => {
          this.preference = response;
          this.showLoading = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  // onClickTest() {
  //   console.log('click');
  // }
}
