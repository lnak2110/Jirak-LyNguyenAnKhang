import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { router } from '../..';
import { RegisterFormInputs } from '../../pages/register/Register';
import { axiosAuth } from '../../utils/config';

export const registerApi = createAsyncThunk(
  'userReducer/register',
  async (registerFormInputs: RegisterFormInputs, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.post('/Users/signup', registerFormInputs);
      console.log(result);
      if (result?.status === 200) {
        router.navigate('/login');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 400) {
        return rejectWithValue('Email is already existed!');
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
};

const initialState = {
  isLoading: false,
  errorMessage: null,
  successMessage: null,
} as InitialStateType;

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerApi.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    builder.addCase(registerApi.fulfilled, (state) => {
      state.isLoading = false;
      state.errorMessage = null;
    });
    builder.addCase(registerApi.rejected, (state, { payload }) => {
      state.isLoading = false;
      console.log(payload);
      if (payload) {
        state.errorMessage = payload as string;
      }
    });
  },
});

export const {} = userReducer.actions;

export default userReducer.reducer;
