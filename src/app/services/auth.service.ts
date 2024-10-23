import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://6710006ca85f4164ef2cbf7a.mockapi.io/api';

  constructor(private http: HttpClient) {}

  register(userData: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/users`, userData);
  }
}
