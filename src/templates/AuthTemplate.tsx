import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/configStore';

const AuthTemplate = () => {
  const { userLogin } = useAppSelector((state) => state.userReducer);

  if (userLogin) {
    return <Navigate to="/projects" />;
  }

  return <Outlet />;
};

export default AuthTemplate;
