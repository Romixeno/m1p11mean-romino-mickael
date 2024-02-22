import { Injectable, inject } from '@angular/core';
import { User } from '../Models/user.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http: HttpClient = inject(HttpClient);
  constructor() {}
}
