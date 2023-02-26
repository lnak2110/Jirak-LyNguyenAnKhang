import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { router } from '../../App';
import { ProjectDetailWithTasksType } from '../../types/projectTypes';
import {
  CurrentUserDataType,
  EditUserFormInputs,
  LoginFormInputs,
  RegisterFormInputs,
  UserAndProjectType,
  UserAndTaskType,
  UserDetailType,
  UserLogin,
} from '../../types/userTypes';
import {
  axiosAuth,
  eraseCookie,
  eraseStore,
  getStoreJson,
  setCookie,
  setStore,
} from '../../utils/config';
import { RootState } from '../configStore';

export const registerAPI = createAsyncThunk(
  'userReducer/registerAPI',
  async (registerFormInputs: RegisterFormInputs, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/Users/signup', registerFormInputs);

      if (result?.status === 200) {
        router.navigate('/login');
        toast.success('Register successfully! Please log in to continue.');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Email is already existed!');
        return rejectWithValue('Email is already existed!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const loginAPI = createAsyncThunk(
  'userReducer/loginAPI',
  async (loginFormInputs: LoginFormInputs, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/Users/signin', loginFormInputs);

      if (result?.status === 200) {
        const { id, avatar, name, phoneNumber, email, accessToken } =
          result.data.content;
        const currentUserData = {
          id,
          avatar,
          name,
          phoneNumber,
          email,
        } as CurrentUserDataType;

        setStore(process.env.REACT_APP_CURRENT_USER_DATA!, currentUserData);
        setStore(process.env.REACT_APP_USER_LOGIN!, { email, accessToken });
        setCookie(process.env.REACT_APP_ACCESS_TOKEN!, accessToken);

        dispatch(saveCurrentUserDataAction(currentUserData));
        toast.success(
          `Log in successfully! Welcome ${result.data?.content?.name}!`
        );
        return { email, accessToken } as UserLogin;
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Wrong email or password!');
        return rejectWithValue('Wrong email or password!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const getAllUsersAPI = createAsyncThunk(
  'userReducer/getAllUsersAPI',
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get('/Users/getUser');

      if (result?.status === 200) {
        return result.data.content as UserDetailType[];
      }
    } catch (error) {
      if (error) {
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const addUserToProjectAPI = createAsyncThunk(
  'userReducer/addUserToProjectAPI',
  async (
    userAndProjectData: UserAndProjectType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const result = await axiosAuth.post(
        '/Project/assignUserProject',
        userAndProjectData
      );

      if (result?.status === 200) {
        // Refresh users list in the project
        await dispatch(getUserByProjectIdAPI(userAndProjectData.projectId));
        toast.success('Add user to this project successfully!');
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
        return rejectWithValue('You are not the creator of this project!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteUserFromTaskAPI = createAsyncThunk(
  'userReducer/deleteUserFromTaskAPI',
  async (userAndTaskData: UserAndTaskType, { rejectWithValue }) => {
    try {
      await axiosAuth.post('/Project/removeUserFromTask', userAndTaskData);
    } catch (error) {
      if (error) {
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteUserFromProjectAPI = createAsyncThunk(
  'userReducer/deleteUserFromProjectAPI',
  async (
    userAndProjectData: UserAndProjectType,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const result = await axiosAuth.post(
        '/Project/removeUserFromProject',
        userAndProjectData
      );

      if (result?.status === 200) {
        const { userId, projectId } = userAndProjectData;

        // Refresh users list in the project
        await dispatch(getUserByProjectIdAPI(projectId));

        const state = getState() as RootState;
        const { projectDetailWithTasks } = state.projectReducer as {
          projectDetailWithTasks: ProjectDetailWithTasksType;
        };

        // Delete user from every task that has that user in
        projectDetailWithTasks?.lstTask.forEach((list) =>
          list.lstTaskDeTail?.forEach(async (task) => {
            if (task.assigness.find((assignee) => assignee.id === userId)) {
              await dispatch(
                deleteUserFromTaskAPI({
                  taskId: task.taskId,
                  userId: userId,
                })
              );
            }
          })
        );

        toast.success('Delete user from this project successfully!');
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
        return rejectWithValue('You are not the creator of this project!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const getUserByIdAPI = createAsyncThunk(
  'userReducer/getUserByIdAPI',
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/Users/getUser?keyword=${userId}`);

      if (result?.status === 200) {
        const allUsersFound = result?.data?.content as UserDetailType[];
        const userFound = allUsersFound.find((user) => user.userId === +userId);
        if (userFound) {
          return userFound;
        }
        return null;
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const editCurrentUserProfileAPI = createAsyncThunk(
  'userReducer/editCurrentUserProfileAPI',
  async (
    editUserFormInputs: EditUserFormInputs,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const result = await axiosAuth.put('/Users/editUser', editUserFormInputs);

      if (result?.status === 200) {
        await dispatch(getUserByIdAPI(editUserFormInputs.id));

        const state = getState() as RootState;
        const { userFound } = state.userReducer as {
          userFound: UserDetailType;
        };
        dispatch(
          saveCurrentUserDataAction({
            ...userFound,
            id: userFound.userId,
          })
        );
        toast.success('Update user information successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const editUserAPI = createAsyncThunk(
  'userReducer/editUserAPI',
  async (
    editUserFormInputs: EditUserFormInputs,
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const result = await axiosAuth.put('/Users/editUser', editUserFormInputs);

      if (result?.status === 200) {
        await dispatch(getUserByIdAPI(editUserFormInputs.id));

        const state = getState() as RootState;
        const { userFound } = state.userReducer as {
          userFound: UserDetailType;
        };
        const { currentUserData } = state.userReducer as {
          currentUserData: CurrentUserDataType;
        };

        // Update current user if edited
        if (userFound.userId === currentUserData.id) {
          dispatch(
            saveCurrentUserDataAction({
              ...userFound,
              id: userFound.userId,
            })
          );
        }

        await dispatch(getAllUsersAPI());
        toast.success('Update user information successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteUserAPI = createAsyncThunk(
  'userReducer/deleteUserAPI',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.delete(`/Users/deleteUser?id=${id}`);

      if (result?.status === 200) {
        await dispatch(getAllUsersAPI());
        toast.success('Delete user successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const getUserByProjectIdAPI = createAsyncThunk(
  'userReducer/getUserByProjectIdAPI',
  async (projectId: string | number, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(
        `/Users/getUserByProjectId?idProject=${projectId}`
      );

      if (result?.status === 200) {
        return result.data.content as UserDetailType[];
      }
    } catch (error: any) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  userFulfilled: boolean;
  userLogin: UserLogin | null;
  users: UserDetailType[];
  usersInProject: UserDetailType[] | null;
  userFound: UserDetailType | null;
  currentUserData: CurrentUserDataType | null;
};

const initialState = {
  isLoading: false,
  userFulfilled: false,
  currentUserData:
    getStoreJson(process.env.REACT_APP_CURRENT_USER_DATA!) || null,
  userLogin: getStoreJson(process.env.REACT_APP_USER_LOGIN!) || null,
  users: [],
  usersInProject: [],
  userFound: null,
} as InitialStateType;

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.userLogin = null;
      eraseStore(process.env.REACT_APP_CURRENT_USER_DATA!);
      eraseStore(process.env.REACT_APP_USER_LOGIN!);
      eraseCookie(process.env.REACT_APP_ACCESS_TOKEN!);
    },
    saveCurrentUserDataAction: (
      state,
      { payload }: PayloadAction<CurrentUserDataType>
    ) => {
      state.currentUserData = payload;
      setStore(process.env.REACT_APP_CURRENT_USER_DATA!, payload);
    },
    setFalseUserFulfilledAction: (state) => {
      state.userFulfilled = false;
    },
  },
  extraReducers: (builder) => {
    // registerAPI
    builder.addCase(registerAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // loginAPI
    builder.addCase(loginAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginAPI.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userLogin = action.payload!;
      router.navigate('/projects');
    });
    builder.addCase(loginAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getAllUsersAPI
    builder.addCase(getAllUsersAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllUsersAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.users = payload!;
    });
    builder.addCase(getAllUsersAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getUserByIdAPI
    builder.addCase(getUserByIdAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserByIdAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.userFound = payload!;
    });
    builder.addCase(getUserByIdAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // editCurrentUserProfileAPI
    builder.addCase(editCurrentUserProfileAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editCurrentUserProfileAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.userFulfilled = true;
    });
    builder.addCase(editCurrentUserProfileAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getUserByProjectIdAPI
    builder.addCase(getUserByProjectIdAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserByProjectIdAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.usersInProject = payload!;
    });
    builder.addCase(getUserByProjectIdAPI.rejected, (state) => {
      state.isLoading = false;
    });

    // addUserToProjectAPI, deleteUserFromProjectAPI
    builder.addMatcher(
      isAnyOf(addUserToProjectAPI.pending, deleteUserFromProjectAPI.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        addUserToProjectAPI.fulfilled,
        deleteUserFromProjectAPI.fulfilled
      ),
      (state) => {
        state.isLoading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(addUserToProjectAPI.rejected, deleteUserFromProjectAPI.rejected),
      (state) => {
        state.isLoading = false;
      }
    );
  },
});

export const {
  logoutAction,
  saveCurrentUserDataAction,
  setFalseUserFulfilledAction,
} = userReducer.actions;

export default userReducer.reducer;
