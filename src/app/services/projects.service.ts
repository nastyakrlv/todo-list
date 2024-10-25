import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProject } from '../interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'https://66fd80996993693089556892.mockapi.io/api/projects';

  constructor(private httpClient: HttpClient) {}

  get projects$(): Observable<IProject[]> {
    return this.httpClient.get<IProject[]>(this.apiUrl);
  }

  getProjectById$(id: string): Observable<IProject> {
    return this.httpClient.get<IProject>(this.apiUrl + `/${id}`);
  }
}
