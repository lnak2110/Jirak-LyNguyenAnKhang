export type Creator = {
  id: number;
  name: string;
};

export type Member = {
  userId?: number;
  name: string;
  avatar: string;
};

export type Task = {
  statusId: string;
  statusName: string;
  alias: string;
  lstTaskDeTail: [];
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

export type ProjectDetailWithTasksType = ProjectDetailType & {
  lstTask: Task[];
  projectCategory: EditProjectCategoryType;
} & Omit<ProjectDetailType, 'categoryId' | 'categoryName' | 'deleted'>;

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
