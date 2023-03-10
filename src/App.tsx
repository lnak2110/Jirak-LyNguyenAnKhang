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
import CreateProject from './pages/createProject/CreateProject';
import EditProject from './pages/editProject/EditProject';
import Login from './pages/login/Login';
import ProjectBoard from './pages/projectBoard/ProjectBoard';
import Projects from './pages/projects/Projects';
import Register from './pages/register/Register';
import Users from './pages/users/Users';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { cyan, deepPurple, green, indigo } from '@mui/material/colors';
import { ConfirmProvider } from 'material-ui-confirm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const theme = createTheme({
  palette: {
    cyan: {
      main: cyan[700],
      contrastText: '#fff',
    },
    deepPurple: {
      main: deepPurple[400],
      contrastText: '#fff',
    },
    green: {
      main: green[600],
      contrastText: '#fff',
    },
    indigo: {
      main: indigo[600],
      contrastText: '#fff',
    },
  },
});

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
              <Route path="create" element={<CreateProject />}></Route>
              <Route path=":projectId/edit" element={<EditProject />}></Route>
              <Route path=":projectId/board" element={<ProjectBoard />}></Route>
            </Route>
            <Route path="/users" element={<Users />}></Route>
          </Route>
          <Route path="*" element={<Navigate to="/projects" />}></Route>
        </Routes>
      </Provider>
    ),
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </ThemeProvider>
  );
};

export default App;
