import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CommentInTask } from '../../types/commentTypes';
import { axiosAuth } from '../../utils/config';

export const getAllCommentAPI = createAsyncThunk(
  'commentReducer/getAllCommentAPI',
  async (taskId: number) => {
    try {
      const result = await axiosAuth.get(`/Comment/getAll?taskId=${taskId}`);

      if (result?.status === 200) {
        return result.data.content as CommentInTask[];
      }
    } catch (error) {
      console.log(error);
    }
  }
);

type InitialStateType = {
  isLoading: boolean;
  allCommentsInTask: CommentInTask[];
};

const initialState = {
  isLoading: false,
  allCommentsInTask: [],
} as InitialStateType;

const commentReducer = createSlice({
  name: 'commentReducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getAllCommentAPI
    builder.addCase(getAllCommentAPI.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllCommentAPI.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.allCommentsInTask = payload!;
    });
    builder.addCase(getAllCommentAPI.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {} = commentReducer.actions;

export default commentReducer.reducer;
