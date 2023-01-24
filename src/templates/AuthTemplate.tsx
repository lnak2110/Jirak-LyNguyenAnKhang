import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/configStore';

const AuthTemplate = () => {
  const { userLogin } = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLogin) {
      navigate('/projects');
    }
  }, [userLogin]);

  return <Outlet />;
};

export default AuthTemplate;
