import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadersComponent } from './components/headers/headers.component';
import { HeroComponent } from './components/hero/hero.component';
import { SectionServicesComponent } from './components/section-services/section-services.component';
import { ScrollDirective } from './Directives/scroll.directive';
import { SectionAboutUsComponent } from './components/section-about-us/section-about-us.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeMessageComponent } from './components/welcome-message/welcome-message.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { ServicesComponent } from './pages/services/services.component';
import { ManagersComponent } from './pages/managers/managers.component';
import { MgLoginPageComponent } from './pages/managers/mg-login-page/mg-login-page.component';
import { MgHeaderComponent } from './pages/managers/components/mg-header/mg-header.component';
import { MgServicesPageComponent } from './pages/managers/mg-services-page/mg-services-page.component';
import { MgServicesFormComponent } from './pages/managers/components/mg-services-form/mg-services-form.component';
import { MgServicesTableComponent } from './pages/managers/components/mg-services-table/mg-services-table.component';
import { DragDirective } from './Directives/drag.directive';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { MgEmployeesPageComponent } from './pages/managers/mg-employees-page/mg-employees-page.component';
import { MgEmployeesTableComponent } from './pages/managers/components/mg-employees-table/mg-employees-table.component';
import { MgEmployeesFormComponent } from './pages/managers/mg-employees-page/mg-employees-form/mg-employees-form.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeLoginPageComponent } from './pages/employees/employee-login-page/employee-login-page.component';
import { ClientGuestLinkComponent } from './components/headers/client-guest-link/client-guest-link.component';
import { EmployeeLinkComponent } from './components/headers/employee-link/employee-link.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DurationFormatPipe } from './pipe/duration-format.pipe';
import {
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { ProfileComponent } from './pages/profile/profile.component';
import { ClientProfileComponent } from './pages/profile/client-profile/client-profile.component';
import { EmployeeProfileComponent } from './pages/profile/employee-profile/employee-profile.component';
@NgModule({
  declarations: [
    AppComponent,
    HeadersComponent,
    HeroComponent,
    SectionServicesComponent,
    ScrollDirective,
    SectionAboutUsComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    WelcomeMessageComponent,
    SignUpComponent,
    ServicesComponent,
    ManagersComponent,
    MgLoginPageComponent,
    MgHeaderComponent,
    MgServicesPageComponent,
    MgServicesFormComponent,
    MgServicesTableComponent,
    DragDirective,
    ConfirmModalComponent,
    MgEmployeesPageComponent,
    MgEmployeesTableComponent,
    MgEmployeesFormComponent,
    EmployeesComponent,
    EmployeeLoginPageComponent,
    ClientGuestLinkComponent,
    EmployeeLinkComponent,
    AppointmentComponent,
    DurationFormatPipe,
    ProfileComponent,
    ClientProfileComponent,
    EmployeeProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'fr' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
