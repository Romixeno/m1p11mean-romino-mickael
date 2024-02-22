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

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'appointment',
    canDeactivate: [
      (comp: AppointmentComponent) => {
        return comp.canExit();
      },
    ],
    component: AppointmentComponent,
  },
  {
    path: 'login',
    canActivate: [CanActivateLoginPage],
    component: LoginComponent,
  },
  {
    path: 'signup',
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
    ],
  },
  {
    path: 'employee',
    children: [
      { path: '', component: EmployeesComponent },
      { path: 'login', component: EmployeeLoginPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
