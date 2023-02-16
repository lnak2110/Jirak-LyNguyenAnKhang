import { ListTaskType } from './taskTypes';

export type Creator = {
  id: number;
  name: string;
};

export type Member = {
  userId?: number;
  name: string;
  avatar: string;
};

export type ProjectDetailType = {
  members: Member[];
  creator: Creator;
  id: number;
  projectName: string;
  description: string;
  categoryId: number;
  categoryName: string;
  alias: string;
  deleted: boolean;
};

export type ProjectDetailWithTasksType = Omit<
  ProjectDetailType,
  'lstTask' | 'categoryId' | 'categoryName' | 'deleted'
> & {
  lstTask: ListTaskType[];
  projectCategory: EditProjectCategoryType;
};

export type EditProjectCategoryType = {
  id: number;
  name: string;
};

export type CreateProjectFormInputs = {
  projectName: string;
  category: ProjectCategoryType | null;
  description: string;
};

export type EditProjectFormInputs = {
  id: number;
  projectName: string;
  category: EditProjectCategoryType | null;
  description: string;
};

export type ProjectCategoryType = {
  id: number;
  projectCategoryName: string;
};
