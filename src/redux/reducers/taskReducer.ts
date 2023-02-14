import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  CreateTaskFormInputs,
  PriorityType,
  StatusType,
  TaskTypeType,
} from '../../types/taskTypes';
import { axiosAuth } from '../../utils/config';
import { getProjectDetailAPI } from './projectReducer';

export const getAllStatusAPI = createAsyncThunk(
  'taskReducer/getAllStatusAPI',
  async () => {
    try {
      const result = await axiosAuth.get('/Status/getAll');

      if (result?.status === 200) {
        return result.data.content as StatusType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllPriorityAPI = createAsyncThunk(
  'taskReducer/getAllPriorityAPI',
  async () => {
    try {
      const result = await axiosAuth.get('/Priority/getAll');

      if (result?.status === 200) {
        return result.data.content as PriorityType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getAllTaskTypeAPI = createAsyncThunk(
  'taskReducer/getAllTaskTypeAPI',
  async () => {
    try {
      const result = await axiosAuth.get('/TaskType/getAll');

      if (result?.status === 200) {
        return result.data.content as TaskTypeType[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const createTaskAPI = createAsyncThunk(
  'taskReducer/createTaskAPI',
  async (
    createTaskFormInputs: CreateTaskFormInputs,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const dataCreateTask = {
        ...createTaskFormInputs,
        listUserAsign: createTaskFormInputs?.listUserAsign?.map(
          (user) => user.userId
        ),
      };

      const result = await axiosAuth.post(
        '/Project/createTask',
        dataCreateTask
      );
      console.log(result);
      if (result?.status === 200) {
        dispatch(getProjectDetailAPI(createTaskFormInputs.projectId));
        toast.success('Create a task successfully!');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error('You are not the creator of this project!');
        return rejectWithValue('You are not the creator of this project!');
      } else if (error.response?.status === 500) {
        toast.error('Task name is already existed!');
        return rejectWithValue('Task name is already existed!');
      } else {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  taskFulfilled: boolean;
  allStatus: StatusType[];
  allPriority: PriorityType[];
  allTaskType: TaskTypeType[];
};

const initialState = {
  isLoading: false,
  taskFulfilled: false,
  allStatus: [],
  allPriority: [],
  allTaskType: [],
} as InitialStateType;

const taskReducer = createSlice({
  name: 'taskReducer',
  initialState,
  reducers: {
    setFalseTaskFulfilledAction: (state) => {
      state.taskFulfilled = false;
    },
  },
  extraReducers: (builder) => {
    // getAllStatusAPI
    builder.addCase(getAllStatusAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllStatusAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.allStatus = payload!;
    });
    builder.addCase(getAllStatusAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getAllPriorityAPI
    builder.addCase(getAllPriorityAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllPriorityAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.allPriority = payload!;
    });
    builder.addCase(getAllPriorityAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // getAllTaskTypeAPI
    builder.addCase(getAllTaskTypeAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllTaskTypeAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.allTaskType = payload!;
    });
    builder.addCase(getAllTaskTypeAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // createTaskAPI
    builder.addCase(createTaskAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTaskAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.taskFulfilled = true;
    });
    builder.addCase(createTaskAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setFalseTaskFulfilledAction } = taskReducer.actions;

export default taskReducer.reducer;
