import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { userType } from './Models/userType.type';

export const CanActivate = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.getUser()) {
    return true; // Allow activation if there's no user
  } else {
    router.navigate(['/']); // Redirect to home page if user exists
    return false; // Prevent activation if user exists
  }
};

// export const CanActivateManager = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   const userType: userType = authService.getUserType();
//   console.log(userType);
//   if (!userType || userType == 'Client' || userType == 'Employee') {
//     return false;
//   } else {
//     router.createUrlTree(['/']);
//     return true;
//   }
// };
// export const CanActivateChildManager = () => {
//   return CanActivateManager();
// };

export const CanActivateChild = () => {
  return CanActivate();
};

// export const resolve = () =>{
//     const courseService = inject(CourseService);
//     return courseService.getAllcourses();
// }
