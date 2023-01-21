import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { router } from '../..';
import { LoginFormInputs } from '../../pages/login/Login';
import { RegisterFormInputs } from '../../pages/register/Register';
import {
  axiosAuth,
  getStoreJson,
  setCookie,
  setStore,
} from '../../utils/config';

export type UserLogin = {
  email: string;
  accessToken: string;
};

export const registerApi = createAsyncThunk(
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

export const loginApi = createAsyncThunk(
  'userReducer/login',
  async (loginFormInputs: LoginFormInputs, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/Users/signin', loginFormInputs);
      console.log(result);
      if (result?.status === 200) {
        const { email, accessToken } = result.data.content;
        setStore(process.env.REACT_APP_USER_LOGIN!, { email, accessToken });
        setCookie(process.env.REACT_APP_ACCESS_TOKEN!, accessToken);

        router.navigate('/');
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

type InitialStateType = {
  isLoading: boolean;
  userLogin: UserLogin | null;
};

const initialState = {
  isLoading: false,
  userLogin: getStoreJson(process.env.REACT_APP_USER_LOGIN!) || null,
} as InitialStateType;

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerApi.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerApi.rejected, (state) => {
      state.isLoading = false;
    });
    // Login
    builder.addCase(loginApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userLogin = action.payload!;
    });
    builder.addCase(loginApi.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {} = userReducer.actions;

export default userReducer.reducer;
