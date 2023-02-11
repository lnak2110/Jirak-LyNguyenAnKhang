import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { router } from '../../App';
import {
  LoginFormInputs,
  RegisterFormInputs,
  UserAndProjectType,
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
import { getProjectDetailAPI } from './projectReducer';

export const registerAPI = createAsyncThunk(
  'userReducer/register',
  async (registerFormInputs: RegisterFormInputs, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/Users/signup', registerFormInputs);
      console.log(result);
      if (result?.status === 200) {
        router.navigate('/login');
        toast.success('Register successfully! Please log in to continue.');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Email is already existed!');
        return rejectWithValue('Email is already existed!');
      }
    }
  }
);

export const loginAPI = createAsyncThunk(
  'userReducer/login',
  async (loginFormInputs: LoginFormInputs, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/Users/signin', loginFormInputs);
      console.log(result);
      if (result?.status === 200) {
        const { email, accessToken } = result.data.content;
        setStore(process.env.REACT_APP_USER_LOGIN!, { email, accessToken });
        setCookie(process.env.REACT_APP_ACCESS_TOKEN!, accessToken);

        toast.success(
          `Log in successfully! Welcome ${result.data?.content?.name}!`
        );
        return { email, accessToken } as UserLogin;
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 400) {
        toast.error('Wrong email or password!');
        return rejectWithValue('Wrong email or password!');
      }
    }
  }
);

export const getAllUsersAPI = createAsyncThunk(
  'userReducer/getAllUsersAPI',
  async () => {
    try {
      const result = await axiosAuth.get('/Users/getUser');
      if (result?.status === 200) {
        return result.data.content as UserDetailType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const addUserToProjectAPI = createAsyncThunk(
  'userReducer/addUserToProjectAPI',
  async (userAndProjectData: UserAndProjectType, thunkAPI) => {
    try {
      const result = await axiosAuth.post(
        '/Project/assignUserProject',
        userAndProjectData
      );
      console.log(result);

      if (result?.status === 200) {
        // Refresh users list in the project
        thunkAPI.dispatch(
          getProjectDetailAPI(userAndProjectData.projectId.toString())
        );
        toast.success('Add user to this project successfully!');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
      } else {
        toast.error('Something wrong happened!');
      }
    }
  }
);

export const deleteUserFromProjectAPI = createAsyncThunk(
  'userReducer/deleteUserFromProjectAPI',
  async (userAndProjectData: UserAndProjectType, thunkAPI) => {
    try {
      const result = await axiosAuth.post(
        '/Project/removeUserFromProject',
        userAndProjectData
      );

      if (result?.status === 200) {
        // Refresh users list in the project
        thunkAPI.dispatch(
          getProjectDetailAPI(userAndProjectData.projectId.toString())
        );
        toast.success('Delete user from this project successfully!');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
      } else {
        toast.error('Something wrong happened!');
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  userLogin: UserLogin | null;
  users: UserDetailType[];
};

const initialState = {
  isLoading: false,
  userLogin: getStoreJson(process.env.REACT_APP_USER_LOGIN!) || null,
  users: [],
} as InitialStateType;

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.userLogin = null;
      eraseStore(process.env.REACT_APP_USER_LOGIN!);
      eraseCookie(process.env.REACT_APP_ACCESS_TOKEN!);
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // Login
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

export const { logoutAction } = userReducer.actions;

export default userReducer.reducer;
