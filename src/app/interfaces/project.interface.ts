import { IUserInfo } from './user-info.interface';
import { ICategory } from './category.interface';
import { ITask } from './task.interface';

export interface IProject {
  id: string;
  type: string;
  name: string;
  users: IUserInfo[];
  categories: ICategory[];
  tasks: ITask[];
}
