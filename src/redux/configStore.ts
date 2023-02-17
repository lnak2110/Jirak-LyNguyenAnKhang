import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { TypedUseSelectorHook } from 'react-redux/es/types';
import commentReducer from './reducers/commentReducer';
import projectReducer from './reducers/projectReducer';
import taskReducer from './reducers/taskReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    userReducer,
    projectReducer,
    taskReducer,
    commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
