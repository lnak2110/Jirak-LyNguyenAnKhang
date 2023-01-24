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
import AuthTemplate from './templates/AuthTemplate';
import HomeTemplate from './templates/HomeTemplate';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Projects from './pages/projects/Projects';
import CreateProject from './pages/createProject/CreateProject';
import Users from './pages/users/Users';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const router = createBrowserRouter([
  {
    path: '*',
    element: (
      <Provider store={store}>
        <Routes>
          <Route element={<AuthTemplate />}>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/login" element={<Login />}></Route>
          </Route>
          <Route element={<HomeTemplate />}>
            <Route path="/" element={<Navigate to="/projects" />}></Route>
            <Route path="/projects">
              <Route index element={<Projects />}></Route>
              <Route path="new" element={<CreateProject />}></Route>
            </Route>
            <Route path="/users" element={<Users />}></Route>
          </Route>
          <Route path="*" element={<Navigate to="/projects" />}></Route>
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
