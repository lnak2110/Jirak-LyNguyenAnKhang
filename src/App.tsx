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
import EditProject from './pages/editProject/EditProject';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const theme = createTheme({
  components: {
    MuiMenu: {
      defaultProps: { disableScrollLock: true },
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
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
