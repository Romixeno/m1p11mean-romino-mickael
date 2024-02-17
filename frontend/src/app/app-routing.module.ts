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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
