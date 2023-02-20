import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  AddCommentToTaskType,
  CommentInTaskType,
  DeleteCommentType,
  EditCommentType,
} from '../../types/commentTypes';
import { axiosAuth } from '../../utils/config';

export const getAllCommentsAPI = createAsyncThunk(
  'commentReducer/getAllCommentsAPI',
  async (taskId: number, { rejectWithValue }) => {
    try {
      const result = await axiosAuth.get(`/Comment/getAll?taskId=${taskId}`);

      if (result?.status === 200) {
        return result.data.content as CommentInTaskType[];
      }
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const addCommentToTaskAPI = createAsyncThunk(
  'commentReducer/addCommentToTaskAPI',
  async (
    addCommentToTaskData: AddCommentToTaskType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const result = await axiosAuth.post(
        '/Comment/insertComment',
        addCommentToTaskData
      );

      if (result?.status === 200) {
        dispatch(getAllCommentsAPI(addCommentToTaskData.taskId));
        toast.success('Add a comment successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const editCommentAPI = createAsyncThunk(
  'commentReducer/editCommentAPI',
  async (editCommentData: EditCommentType, { dispatch, rejectWithValue }) => {
    try {
      const { taskId, id, contentComment } = editCommentData;
      const result = await axiosAuth.put(
        `/Comment/updateComment?id=${id}&contentComment=${contentComment}`
      );

      if (result?.status === 200) {
        dispatch(getAllCommentsAPI(taskId));
        toast.success('Edit your comment successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

export const deleteCommentAPI = createAsyncThunk(
  'commentReducer/deleteCommentAPI',
  async (
    deleteCommentData: DeleteCommentType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { idComment, taskId } = deleteCommentData;
      const result = await axiosAuth.delete(
        `/Comment/deleteComment?idComment=${idComment}`
      );

      if (result?.status === 200) {
        dispatch(getAllCommentsAPI(taskId));
        toast.success('Delete your comment successfully!');
      }
    } catch (error) {
      if (error) {
        toast.error('Something wrong happened!');
        return rejectWithValue('Something wrong happened!');
      }
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  commentFulfilled: boolean;
  allCommentsInTask: CommentInTaskType[];
};

const initialState = {
  isLoading: false,
  commentFulfilled: false,
  allCommentsInTask: [],
} as InitialStateType;

const commentReducer = createSlice({
  name: 'commentReducer',
  initialState,
  reducers: {
    setFalseCommentFulfilledAction: (state) => {
      state.commentFulfilled = false;
    },
  },
  extraReducers: (builder) => {
    // getAllCommentsAPI
    builder.addCase(getAllCommentsAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCommentsAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.allCommentsInTask = payload!;
    });
    builder.addCase(getAllCommentsAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // addCommentToTaskAPI
    builder.addCase(addCommentToTaskAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addCommentToTaskAPI.fulfilled, (state) => {
      state.isLoading = false;
      state.commentFulfilled = true;
    });
    builder.addCase(addCommentToTaskAPI.rejected, (state) => {
      state.isLoading = false;
    });
    // editCommentAPI
    builder.addCase(editCommentAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editCommentAPI.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(editCommentAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setFalseCommentFulfilledAction } = commentReducer.actions;

export default commentReducer.reducer;
