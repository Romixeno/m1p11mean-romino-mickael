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
import { ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
