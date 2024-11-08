import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IUser } from '../interfaces';
import { IUserName } from '../interfaces/user-name.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'https://66fd80996993693089556892.mockapi.io/api/users';

  constructor(private httpClient: HttpClient) {}

  getUserById(userId: string): Observable<IUserName> {
    return this.httpClient.get<IUser>(`${this.apiUrl}/${userId}`).pipe(
      map((user) => {
        return {
          name: user.name || '',
          email: user.email,
        };
      })
    );
  }

  getUserByEmail(userEmail: string): Observable<IUserName> {
    return this.httpClient.get<IUserName[]>(this.apiUrl).pipe(
      map((users) => {
        const user = users.find((u) => u.email === userEmail);
        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } else {
          throw new Error(
            `Нет зарегистрирвоанного пользователя с почтой: ${userEmail}`
          );
        }
      })
    );
  }
}
