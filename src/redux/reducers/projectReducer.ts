import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosAuth } from '../../utils/config';

type Creator = {
  id: number;
  name: string;
};

export type Member = {
  userId: number;
  name: string;
  avatar: string;
};

export type CreateProjectFormInputs = {
  projectName: string;
  categoryId: number;
  description: string;
};

type ProjectDetailType = {
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

type ProjectCategoryType = {
  id: number;
  projectCategoryName: string;
};

export const getAllProjectsAPI = createAsyncThunk(
  'projectReducer/getAllProjectsAPI',
  async () => {
    try {
      const result = await axiosAuth.get('/Project/getAllProject');
      if (result?.status === 200) {
        return result.data.content as ProjectDetailType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getProjectCategoriesAPI = createAsyncThunk(
  'projectReducer/getProjectCategoriesAPI',
  async () => {
    try {
      const result = await axiosAuth.get('/ProjectCategory');

      if (result?.status === 200) {
        return result.data.content as ProjectCategoryType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  projects: ProjectDetailType[];
  projectCategories: ProjectCategoryType[];
};

const initialState = {
  isLoading: false,
  projects: [],
  projectCategories: [],
} as InitialStateType;

const projectReducer = createSlice({
  name: 'projectReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllProjectsAPI
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
    // getProjectCategoriesAPI
    builder.addCase(getProjectCategoriesAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProjectCategoriesAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projectCategories = payload!;
    });
    builder.addCase(getProjectCategoriesAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {} = projectReducer.actions;

export default projectReducer.reducer;
