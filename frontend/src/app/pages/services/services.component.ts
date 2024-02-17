import { Component, inject } from '@angular/core';
import { ServiceModel } from '../../Models/service.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  searchedText: string = '';
  selectedType: string = 'All';
  servicesType: string[] = ['Hair', 'Makeup', 'Nail'];
  servicesList: ServiceModel[] = [
    {
      type: 'Hair',
      name: 'Hair Styling with Curls',
      price: 10.0,
      duration: 15,
      commission: 0.1,
      image: '../../../assets/hair.jpg',
      description:
        'Get your hair styled with beautiful curls for a stunning look.',
    },
    {
      type: 'Nail',
      name: 'Manicure',
      price: 20.0,
      duration: 30,
      commission: 0.15,
      image: '../../../assets/hair.jpg',
      description:
        'Treat yourself to a manicure and give your nails the care they deserve.',
    },
    {
      type: 'Makeup',
      name: 'Evening Makeup',
      price: 30.0,
      duration: 45,
      commission: 0.2,
      image: '../../../assets/hair.jpg',
      description:
        'Get your makeup done professionally for an elegant evening look.',
    },
    {
      type: 'Hair',
      name: 'Haircut',
      price: 15.0,
      duration: 30,
      commission: 0.12,
      image: '../../../assets/hair.jpg',
      description: 'Refresh your hairstyle with a professional haircut.',
    },
    {
      type: 'Nail',
      name: 'Pedicure',
      price: 25.0,
      duration: 45,
      commission: 0.18,
      image: '../../../assets/pedicure_manicure.jpg',
      description:
        'Indulge in a relaxing pedicure session and pamper your feet.',
    },
    {
      type: 'Makeup',
      name: 'Bridal Makeup',
      price: 50.0,
      duration: 60,
      commission: 0.25,
      image: '../../../assets/hair.jpg',
      description:
        'Look radiant on your special day with our expert bridal makeup service.',
    },
    {
      type: 'Hair',
      name: 'Hair Coloring',
      price: 40.0,
      duration: 90,
      commission: 0.25,
      image: '../../../assets/hair.jpg',
      description:
        'Transform your hair with our professional hair coloring services.',
    },
    {
      type: 'Nail',
      name: 'Nail Art',
      price: 35.0,
      duration: 60,
      commission: 0.2,
      image: '../../../assets/hair.jpg',
      description:
        'Express your creativity with our stunning nail art designs.',
    },
    {
      type: 'Makeup',
      name: 'Natural Makeup',
      price: 25.0,
      duration: 30,
      commission: 0.15,
      image: '../../../assets/hair.jpg',
      description:
        'Enhance your natural beauty with our subtle and flawless makeup.',
    },
    {
      type: 'Hair',
      name: 'Hair Extensions',
      price: 50.0,
      duration: 120,
      commission: 0.3,
      image: '../../../assets/hair.jpg',
      description:
        'Add length and volume to your hair with our high-quality hair extensions.',
    },
  ];

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((query) => {
      console.log(query);
    });
  }

  onFilterTypeChange(val: any) {
    const value = val.target.value;
    this.selectedType = value;
    if (value == 'All') {
      this.servicesType = ['Hair', 'Makeup', 'Nail'];
    } else {
      this.servicesType = [value];
    }
  }

  onBtnFilterApplyClicked() {
    let queryParams: any = { filterBy: this.selectedType };
    if (this.searchedText != '') {
      queryParams = { q: this.searchedText, ...queryParams };
    }
    this.router.navigate(['/services'], {
      queryParams,
    });
  }
}
