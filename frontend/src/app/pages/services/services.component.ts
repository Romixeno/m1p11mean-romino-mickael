import { Component, OnDestroy, inject } from '@angular/core';
import { ServiceModel } from '../../Models/service.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';

import { HttpErrorResponse } from '@angular/common/http';
import { ServiceTypeModel } from '../../Models/serviceType.model';
import { response } from 'express';
import { userType } from '../../Models/userType.type';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PreferencesModel } from '../../Models/preferences.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
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
export class ServicesComponent implements OnDestroy {
  showLoading: boolean = false;
  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  serviceService: ServiceService = inject(ServiceService);
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  searchedText: string = '';
  selectedCategory: string = 'Hair';
  servicesType: ServiceTypeModel[];
  servicesList: ServiceModel[] = [
    // {
    //   type: 'Hair',
    //   name: 'Hair Styling with Curls',
    //   price: 10.0,
    //   duration: 15,
    //   commission: 0.1,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Get your hair styled with beautiful curls for a stunning look.',
    // },
    // {
    //   type: 'Nail',
    //   name: 'Manicure',
    //   price: 20.0,
    //   duration: 30,
    //   commission: 0.15,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Treat yourself to a manicure and give your nails the care they deserve.',
    // },
    // {
    //   type: 'Makeup',
    //   name: 'Evening Makeup',
    //   price: 30.0,
    //   duration: 45,
    //   commission: 0.2,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Get your makeup done professionally for an elegant evening look.',
    // },
    // {
    //   type: 'Hair',
    //   name: 'Haircut',
    //   price: 15.0,
    //   duration: 30,
    //   commission: 0.12,
    //   image: '../../../assets/hair.jpg',
    //   description: 'Refresh your hairstyle with a professional haircut.',
    // },
    // {
    //   type: 'Nail',
    //   name: 'Pedicure',
    //   price: 25.0,
    //   duration: 45,
    //   commission: 0.18,
    //   image: '../../../assets/pedicure_manicure.jpg',
    //   description:
    //     'Indulge in a relaxing pedicure session and pamper your feet.',
    // },
    // {
    //   type: 'Makeup',
    //   name: 'Bridal Makeup',
    //   price: 50.0,
    //   duration: 60,
    //   commission: 0.25,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Look radiant on your special day with our expert bridal makeup service.',
    // },
    // {
    //   type: 'Hair',
    //   name: 'Hair Coloring',
    //   price: 40.0,
    //   duration: 90,
    //   commission: 0.25,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Transform your hair with our professional hair coloring services.',
    // },
    // {
    //   type: 'Nail',
    //   name: 'Nail Art',
    //   price: 35.0,
    //   duration: 60,
    //   commission: 0.2,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Express your creativity with our stunning nail art designs.',
    // },
    // {
    //   type: 'Makeup',
    //   name: 'Natural Makeup',
    //   price: 25.0,
    //   duration: 30,
    //   commission: 0.15,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Enhance your natural beauty with our subtle and flawless makeup.',
    // },
    // {
    //   type: 'Hair',
    //   name: 'Hair Extensions',
    //   price: 50.0,
    //   duration: 120,
    //   commission: 0.3,
    //   image: '../../../assets/hair.jpg',
    //   description:
    //     'Add length and volume to your hair with our high-quality hair extensions.',
    // },
  ];
  filteredServiceList: ServiceModel[];
  errorMessage: string;
  userType: userType;
  preference: PreferencesModel;
  ngOnInit() {
    this.showLoading = true;
    this.userType = this.authService.getUserType();
    if (this.userType == 'Client') {
      const user = this.authService.getUser();
      this.userService.getClientPreferences(user._id).subscribe({
        next: (response: PreferencesModel) => {
          this.preference = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    this.serviceService.getAllServicesTypes().subscribe({
      next: (response: ServiceTypeModel[]) => {
        this.servicesType = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.serviceService
      .searchService({ q: '', filterBy: this.selectedCategory })
      .subscribe({
        next: (response: ServiceModel[]) => {
          this.servicesList = response;
          this.showLoading = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  hasServicesForType(type: string): boolean {
    return this.servicesList.some((service) => service.type === type);
  }
  getServicesForType(type: string): ServiceModel[] {
    return this.servicesList.filter((service) => service.type === type);
  }

  searchBtnClicked() {
    if (
      this.searchedText == '' ||
      this.searchedText == null ||
      this.searchedText == undefined
    ) {
      return;
    }

    const queryParams: any = {
      service: '',
      q: this.searchedText,
    };
    const navigationExtras: NavigationExtras = {
      queryParams,
    };

    this.router.navigate(['/search'], navigationExtras);
  }
  onCategoryChange(event: Event) {
    this.showLoading = true;
    this.serviceService
      .searchService({ q: '', filterBy: this.selectedCategory })
      .subscribe({
        next: (response: ServiceModel[]) => {
          this.servicesList = response;
          this.showLoading = false;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  verifyServicePreference(serviceId: string) {
    return this.preference?.favoriteService.includes(serviceId);
  }

  addRemoveServiceFavorite(serviceId: string) {
    this.showLoading = true;
    const user = this.authService.getUser();
    this.userService.addRemoveServicePreference(user._id, serviceId).subscribe({
      next: (response: PreferencesModel) => {
        this.preference = response;
        this.showLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
