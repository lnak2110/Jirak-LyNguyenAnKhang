import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosAuth } from '../../utils/config';

export type Member = {
  userId: number;
  name: string;
  avatar: string;
};

type Creator = {
  id: number;
  name: string;
};

type ProjectsType = {
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

export const getAllProjectsAPI = createAsyncThunk(
  'projectReducer/getAllProjects',
  async () => {
    try {
      const result = await axiosAuth.get('/Project/getAllProject');
      if (result?.status === 200) {
        return result.data.content as ProjectsType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  projects: ProjectsType[];
};

const initialState: InitialStateType = {
  isLoading: false,
  projects: [],
};

const projectReducer = createSlice({
  name: 'projectReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProjectsAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProjectsAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projects = payload!;
    });
    builder.addCase(getAllProjectsAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {} = projectReducer.actions;

export default projectReducer.reducer;
