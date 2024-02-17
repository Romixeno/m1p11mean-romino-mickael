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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
