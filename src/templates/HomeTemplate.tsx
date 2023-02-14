import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useAppSelector } from '../redux/configStore';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Container from '@mui/material/Container';

const HomeTemplate = () => {
  const { userLogin, isLoading: isLoadingUser } = useAppSelector(
    (state: RootState) => state.userReducer
  );
  const { isLoading: isLoadingTask } = useAppSelector(
    (state: RootState) => state.taskReducer
  );

  if (!userLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
      {isLoadingUser && <Loading />}
      {isLoadingTask && <Loading />}
    </>
  );
};

export default HomeTemplate;
