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

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [CanActivate],
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'services',
    component: ServicesComponent,
  },
  { path: 'manager-login', component: MgLoginPageComponent },
  {
    path: 'manager',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
