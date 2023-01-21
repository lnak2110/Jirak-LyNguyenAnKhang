import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { Provider } from 'react-redux/es/exports';
import store from './redux/configStore';
import Home from './pages/home/Home';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <Provider store={store}>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </Provider>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <ToastContainer />
    <RouterProvider router={router} />
  </React.StrictMode>
);
