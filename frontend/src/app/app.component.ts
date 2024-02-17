import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  router: Router = inject(Router);
  activateRoute: ActivatedRoute = inject(ActivatedRoute);
  showLoader: boolean = false;
  ngOnInit() {
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoader = true;
      }

      if (
        routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError
      ) {
        this.showLoader = false;
      }
    });
  }
}
