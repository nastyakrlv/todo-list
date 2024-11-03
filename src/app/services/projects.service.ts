import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IProject } from '../interfaces/project.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'https://66fd80996993693089556892.mockapi.io/api/projects';

  private authService = inject(AuthService);

  constructor(private httpClient: HttpClient) {}

  get projects$(): Observable<IProject[]> {
    return this.httpClient.get<IProject[]>(this.apiUrl);
  }

  getProjectById$(id: string): Observable<IProject> {
    return this.httpClient.get<IProject>(this.apiUrl + `/${id}`);
  }

  createNewProject(name: string): Observable<IProject> {
    const userId = this.authService.getCurrentUserId();

    return this.httpClient
      .post<IProject>(this.apiUrl, {
        name: name,
        users: [{ id: userId, role: 'Администратор' }],
        type: 'personal',
      })
      .pipe(
        map((project) => {
          return project;
        })
      );
  }

  getCurrentUserRole(project: IProject): string {
    const userId = this.authService.getCurrentUserId();

    const user = project.users.find((user) => user.id === userId);
    return user ? user.role : '';
  }

  getPersonalProjectsByCurrentUser(): Observable<IProject[]> {
    const userId = this.authService.getCurrentUserId();

    const personalProjects$ = this.projects$.pipe(
      map((projects) => {
        return projects.filter((project) => {
          const user = project.users.find((user) => user.id === userId);

          return user && project.type === 'personal';
        });
      })
    );

    return personalProjects$;
  }
}
