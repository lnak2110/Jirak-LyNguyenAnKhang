import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  CreateProjectFormInputs,
  EditProjectFormInputs,
  ProjectCategoryType,
  ProjectDetailType,
  ProjectDetailWithTasksType,
} from '../../types/projectTypes';
import { axiosAuth } from '../../utils/config';

export const getAllProjectsAPI = createAsyncThunk(
  'projectReducer/getAllProjectsAPI',
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get('/Project/getAllProject');
      if (result?.status === 200) {
        return result.data.content as ProjectDetailType[];
      }
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const getProjectCategoriesAPI = createAsyncThunk(
  'projectReducer/getProjectCategoriesAPI',
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get('/ProjectCategory');

      if (result?.status === 200) {
        return result.data.content as ProjectCategoryType[];
      }
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
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
      const { category, ...restFields } = createProjectFormInputs;
      const createProjectData = {
        ...restFields,
        categoryId: category?.id,
      };
      const result = await axiosAuth.post(
        '/Project/createProjectAuthorize',
        createProjectData
      );

      if (result?.status === 200) {
        toast.success('Create a project successfully!');
      }
    } catch (error: any) {
      if (error.response?.status === 500) {
        toast.error('Project name is already existed!');
        return rejectWithValue('Project name is already existed!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const getProjectDetailAPI = createAsyncThunk(
  'projectReducer/getProjectDetailAPI',
  async (projectId: string | number, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(
        `/Project/getProjectDetail?id=${projectId}`
      );

      if (result?.status === 200) {
        return result.data.content as ProjectDetailWithTasksType;
      }
    } catch (error: any) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const updateProjectAPI = createAsyncThunk(
  'projectReducer/updateProjectAPI',
  async (
    editProjectFormInputs: EditProjectFormInputs,
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Change structure of the data to be sent
      const { category, ...restFields } = editProjectFormInputs;
      const editProjectData = {
        ...restFields,
        categoryId: category?.id,
      };
      const result = await axiosAuth.put(
        `/Project/updateProject?projectId=${editProjectFormInputs.id}`,
        editProjectData
      );

      if (result?.status === 200) {
        // API from backend send only categoryId (number)
        await dispatch(getProjectDetailAPI(result.data.content.id));
        toast.success('Update a project successfully!');
      }
    } catch (error: any) {
      if (error) {
        if (error.response?.status === 403) {
          toast.error('You are not the creator of this project!');
          return rejectWithValue('You are not the creator of this project!');
        } else {
          toast.error('Something wrong happened!');
          return rejectWithValue('Something wrong happened!');
        }
      }
    }
  }
);

export const deleteProjectAPI = createAsyncThunk(
  'projectReducer/deleteProjectAPI',
  async (projectId: number, { dispatch, rejectWithValue }) => {
    try {
      const result = await axiosAuth.delete(
        `/Project/deleteProject?projectId=${projectId}`
      );

      if (result?.status === 200) {
        await dispatch(getAllProjectsAPI());
        toast.success('Delete a project successfully!');
      }
    } catch (error: any) {
      if (error) {
        if (error.response?.status === 403) {
          toast.error('You are not the creator of this project!');
          return rejectWithValue('You are not the creator of this project!');
        } else {
          toast.error('Something wrong happened!');
          return rejectWithValue('Something wrong happened!');
        }
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  projects: ProjectDetailType[];
  projectCategories: ProjectCategoryType[];
  projectFulfilled: boolean;
  projectDetailWithTasks: ProjectDetailWithTasksType | null;
};

const initialState = {
  isLoading: false,
  projects: [],
  projectCategories: [],
  projectFulfilled: false,
  projectDetailWithTasks: null,
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
    // getProjectDetailAPI & updateProjectAPI
    builder.addCase(getProjectDetailAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.projectDetailWithTasks = payload!;
    });
    builder.addCase(updateProjectAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addMatcher(
      isAnyOf(getProjectDetailAPI.pending, updateProjectAPI.pending),
      (state) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(getProjectDetailAPI.rejected, updateProjectAPI.rejected),
      (state) => {
        state.isLoading = false;
      }
    );
  },
});

export const { setFalseProjectFulfilledAction } = projectReducer.actions;

export default projectReducer.reducer;
