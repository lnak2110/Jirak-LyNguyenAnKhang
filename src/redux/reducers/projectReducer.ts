import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { axiosAuth } from '../../utils/config';

type Creator = {
  id: number;
  name: string;
};

export type Member = {
  userId?: number;
  name: string;
  avatar: string;
};

export type CreateProjectFormInputs = {
  projectName: string;
  categoryId: ProjectCategoryType | null;
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

export const createProjectAPI = createAsyncThunk(
  'projectReducer/createProjectAPI',
  async (
    createProjectFormInputs: CreateProjectFormInputs,
    { rejectWithValue }
  ) => {
    try {
      // Change structure of the data to be sent
      const { categoryId, ...restFields } = createProjectFormInputs;
      const createProjectData = {
        ...restFields,
        categoryId: categoryId?.id,
      };
      const result = await axiosAuth.post(
        '/Project/createProjectAuthorize',
        createProjectData
      );

      console.log(result);
      if (result?.status === 200) {
        toast.success('Create a project successfully!');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 500) {
        toast.error('Project name is already existed!');
        return rejectWithValue('Project name is already existed!');
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  projects: ProjectDetailType[];
  projectCategories: ProjectCategoryType[];
  projectFulfilled: boolean;
};

const initialState = {
  isLoading: false,
  projects: [],
  projectCategories: [],
  projectFulfilled: false,
} as InitialStateType;

const projectReducer = createSlice({
  name: 'projectReducer',
  initialState,
  reducers: {
    setFalseProjectFulfilledAction: (state) => {
      state.projectFulfilled = false;
    },
  },
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
    // createProjectAPI
    builder.addCase(createProjectAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createProjectAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.projectFulfilled = true;
    });
    builder.addCase(createProjectAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setFalseProjectFulfilledAction } = projectReducer.actions;

export default projectReducer.reducer;
