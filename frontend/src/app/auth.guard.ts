import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

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

export const CanActivateChild = () => {
  return CanActivate();
};

// export const resolve = () =>{
//     const courseService = inject(CourseService);
//     return courseService.getAllcourses();
// }
