import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {
  PreferencesModel,
  PreferencesModelPopulated,
} from '../../Models/preferences.model';
import { ClientModel } from '../../Models/client.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { httpUrl } from '../../utils/utils';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PreferencesComponent {
  baseUrl: string = httpUrl;
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  preference: PreferencesModelPopulated;
  showLoading: boolean = false;
  showConfirmAction: boolean = false;
  selectedData: { selectedId: string; type: string };
  ngOnInit(): void {
    this.showLoading = true;
    const user = this.authService.getUser();
    this.userService.verifyClientId(user._id).subscribe({
      next: (response: any) => {
        this.userService.getPreferencePopulated(response._id).subscribe({
          next: (response: PreferencesModelPopulated) => {
            this.showLoading = false;
            this.preference = response;
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  confirmAction(selectedId: string, type: string) {
    this.selectedData = { selectedId: selectedId, type: type };
    this.showConfirmAction = true;
  }
  closeConfirmAction(event) {
    if (event == 'close') {
      this.showConfirmAction = false;
    } else {
      this.showConfirmAction = false;
      this.showLoading = true;
      const user = this.authService.getUser();
      this.userService.getPreferencePopulated(user._id).subscribe({
        next: (response: PreferencesModelPopulated) => {
          this.showLoading = false;
          this.preference = response;
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }
  addRemoveServiceFavorite(serviceId: string) {
    this.showLoading = true;
    const user = this.authService.getUser();
    this.userService.addRemoveServicePreference(user._id, serviceId).subscribe({
      next: (response: PreferencesModel) => {
        this.userService.getPreferencePopulated(user._id).subscribe({
          next: (response: PreferencesModelPopulated) => {
            this.showLoading = false;
            this.preference = response;
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  // verifyServicePreference(serviceId: string) {
  //   const fav = this.preference.favoriteService.find(
  //     (service) => service._id == serviceId
  //   );
  //   if (fav) {
  //     return true;
  //   }
  //   return false;
  // }
}
