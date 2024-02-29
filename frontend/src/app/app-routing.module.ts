import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CanActivate } from './auth.guard';
import { ServicesComponent } from './pages/services/services.component';
import { MgLoginPageComponent } from './pages/managers/mg-login-page/mg-login-page.component';
import path from 'path';
import { MgServicesPageComponent } from './pages/managers/mg-services-page/mg-services-page.component';
import { MgEmployeesPageComponent } from './pages/managers/mg-employees-page/mg-employees-page.component';
import { MgEmployeesFormComponent } from './pages/managers/mg-employees-page/mg-employees-form/mg-employees-form.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeLoginPageComponent } from './pages/employees/employee-login-page/employee-login-page.component';
import { CanActivateManager } from './guard/manager.guard';
import { CanActivateLoginPage } from './guard/pageLogin.guard';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { appointmentGuard } from './guard/appointment.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { onlyConnectedGuard } from './guard/only-connected.guard';
import { AppointmentListsComponent } from './pages/appointment/appointment-lists/appointment-lists.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { EmployeeTasksComponent } from './pages/employees/employee-tasks/employee-tasks.component';
import { employeeGuard } from './guard/employee.guard';
import { StaffsComponent } from './pages/staffs/staffs.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { StaffDetailComponent } from './pages/staffs/staff-detail/staff-detail.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { userGuard } from './guard/user.guard';
import { PaymentListsComponent } from './pages/managers/payment-lists/payment-lists.component';
import { MgServiceTypesComponent } from './pages/managers/mg-service-types/mg-service-types.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'about-us',
    children: [
      {
        path: '',
        component: StaffsComponent,
      },
      { path: ':id', component: StaffDetailComponent },
    ],
  },
  {
    path: 'preferences',
    canActivate: [userGuard],
    component: PreferencesComponent,
  },
  {
    path: 'search',
    component: SearchPageComponent,
  },
  {
    path: 'profile',
    canActivate: [onlyConnectedGuard],
    component: ProfileComponent,
  },
  {
    path: 'appointment',
    canActivate: [appointmentGuard],

    // component: AppointmentComponent,
    children: [
      {
        path: '',
        redirectTo: '/appointment/new',
        pathMatch: 'full',
      },
      {
        path: 'new',
        canDeactivate: [
          (comp: AppointmentComponent) => {
            return comp.canExit();
          },
        ],
        component: AppointmentComponent,
      },
      {
        path: 'lists',
        component: AppointmentListsComponent,
      },
    ],
  },
  {
    path: 'login',
    canActivate: [CanActivateLoginPage],
    component: LoginComponent,
  },
  {
    path: 'signup',
    canActivate: [CanActivateLoginPage],
    component: SignUpComponent,
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'manager-login',
    canActivate: [CanActivateLoginPage],
    component: MgLoginPageComponent,
  },
  {
    path: 'manager',
    canActivate: [CanActivateManager],

    children: [
      {
        path: 'services',
        component: MgServicesPageComponent,
      },
      {
        path: 'employees',
        children: [
          { path: '', component: MgEmployeesPageComponent },
          { path: 'add-employees', component: MgEmployeesFormComponent },
        ],
      },
      {
        path: 'payments',
        component: PaymentListsComponent,
      },
      {
        path: 'serviceTypes',
        component: MgServiceTypesComponent,
      },
    ],
  },
  {
    path: 'employee',
    children: [
      { path: '', component: EmployeesComponent, canActivate: [employeeGuard] },
      {
        path: 'login',
        component: EmployeeLoginPageComponent,
        canActivate: [CanActivateLoginPage],
      },
      {
        path: 'myTasks',
        component: EmployeeTasksComponent,
        canActivate: [employeeGuard],
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
