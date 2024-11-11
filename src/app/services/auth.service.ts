import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://66fd80996993693089556892.mockapi.io/api';

  constructor(private http: HttpClient) {}

  register(userData: IUser): Observable<IUser> {
    return this.getUsers().pipe(
      switchMap((users) => {
        const existingUser = users.find((u) => u.email === userData.email);
        if (existingUser) {
          throw new Error('Пользователь с таким email уже существует.');
        }

        return this.http.post<IUser>(`${this.apiUrl}/users`, userData).pipe(
          map((user) => {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              password: user.password,
            };
          })
        );
      })
    );
  }

  login(email: string, password: string): Observable<IUser> {
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
          };
        } else {
          throw new Error('Неверные учетные данные.');
        }
      })
    );
  }

  changePassword(password: string): Observable<IUser> {
    const user: IUser = JSON.parse(localStorage.getItem('user') || '');
    user.password = password;

    return this.http.put<IUser>(`${this.apiUrl}/users/${user.id}`, user).pipe(
      map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      }))
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  saveUser(userData: IUser): void {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  private getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/users`);
  }

  getCurrentUserId(): string {
    const user = JSON.parse(localStorage.getItem('user') || '');

    return user ? user.id : '';
  }
}
