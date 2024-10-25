import { IUserInfo } from './user-info.interface';
import { ICategory } from './category.interface';
import { ITask } from './task.interface';

export interface IProject {
  id: string;
  name: string;
  users: Array<IUserInfo>;
  categories: Array<ICategory>;
  tasks: Array<ITask>;
}
