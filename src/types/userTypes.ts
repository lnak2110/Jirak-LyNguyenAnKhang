export type LoginFormInputs = {
  email: string;
  password: string;
};

export type RegisterFormInputs = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
};

export type EditUserFormInputs = RegisterFormInputs & {
  id: string;
};

export type UserLogin = {
  email: string;
  accessToken: string;
};

export type CurrentUserDataType = {
  id: number;
  avatar: string;
  name: string;
  phoneNumber: string;
  email: string;
};

export type UserAndTaskType = {
  userId: number;
  taskId: number;
};

export type UserAndProjectType = {
  userId: number;
  projectId: number;
};

export type UserDetailType = {
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
};

export type Assignee = {
  id: number;
  name: string;
  avatar: string;
};
