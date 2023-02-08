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

export type UserLogin = {
  email: string;
  accessToken: string;
};

export type UserDetailType = {
  userId: number;
  name: string;
  avatar: string;
  email: string;
  phoneNumber: string;
};
