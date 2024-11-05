import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IProject } from '../interfaces/project.interface';
import { AuthService } from './auth.service';
import { v4 as uuidv4 } from 'uuid';
import { ICreateTask } from '../interfaces/create-task.interface';

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

  createNewCategory(project: IProject, name: string): Observable<IProject> {
    project.categories.push({
      id: uuidv4(),
      name: name,
    });

    return this.httpClient
      .put<IProject>(`${this.apiUrl}/${project.id}`, project)
      .pipe(
        map((project) => {
          return project;
        })
      );
  }

  removeCategory(project: IProject, categoryId: string) {
    const idx = project.categories.findIndex(
      (category) => category.id === categoryId
    );

    if (idx !== -1) {
      project.categories.splice(idx, 1);

      // каскадом удаляем задачи в этой категории
      const filteredTasks = project.tasks.filter(
        (task) => task.categoryId !== categoryId
      );
      project.tasks = filteredTasks;
    }

    return this.httpClient
      .put<IProject>(`${this.apiUrl}/${project.id}`, project)
      .pipe(
        map((project) => {
          return project;
        })
      );
  }

  createNewTask(
    project: IProject,
    categoryId: string,
    task: ICreateTask
  ): Observable<IProject> {
    const userId = this.authService.getCurrentUserId();

    project.tasks.push({
      id: uuidv4(),
      ...task,
      badge: 'Не сделано',
      categoryId: categoryId,
      userId: userId,
    });

    return this.httpClient
      .put<IProject>(`${this.apiUrl}/${project.id}`, project)
      .pipe(
        map((project) => {
          return project;
        })
      );
  }

  removeTask(project: IProject, taskId: string) {
    const idx = project.tasks.findIndex((task) => task.id === taskId);

    if (idx !== -1) {
      project.tasks.splice(idx, 1);
    }

    return this.httpClient
      .put<IProject>(`${this.apiUrl}/${project.id}`, project)
      .pipe(
        map((project) => {
          return project;
        })
      );
  }
}
