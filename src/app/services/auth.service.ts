import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://66fd80996993693089556892.mockapi.io/api/';

  constructor(private http: HttpClient) {}

  register(userData: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/users`, userData);
  }
}
