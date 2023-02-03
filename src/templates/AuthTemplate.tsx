import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useAppSelector } from '../redux/configStore';

const AuthTemplate = () => {
  const { userLogin } = useAppSelector((state: RootState) => state.userReducer);

  if (userLogin) {
    return <Navigate to="/projects" />;
  }

  return <Outlet />;
};

export default AuthTemplate;
