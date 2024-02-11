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

@NgModule({
  declarations: [
    AppComponent,
    HeadersComponent,
    HeroComponent,
    SectionServicesComponent,
    ScrollDirective,
    SectionAboutUsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
