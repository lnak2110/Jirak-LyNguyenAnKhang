import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAppSelector } from '../redux/configStore';

const HomeTemplate = () => {
  const { userLogin } = useAppSelector((state) => state.userReducer);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLogin) {
      navigate('/login');
    }
  }, [userLogin]);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default HomeTemplate;
