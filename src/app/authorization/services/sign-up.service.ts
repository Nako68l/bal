import { Injectable, } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable()
export class SignUpService {
  user: User;

  constructor() { }

  signUp(value: string): Observable<User> {
    this.user.email = value;
    return of(this.user);
  }
}
