import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RegisterFormInputs } from '../../pages/register/Register';
import { axiosAuth } from '../../utils/config';

export const registerApi = createAsyncThunk(
  'userReducer/register',
  async (registerFormInputs: RegisterFormInputs) => {
    try {
      const result = await axiosAuth.post('/Users/signup', registerFormInputs);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  isLoading: false,
};

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerApi.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(registerApi.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {} = userReducer.actions;

export default userReducer.reducer;
