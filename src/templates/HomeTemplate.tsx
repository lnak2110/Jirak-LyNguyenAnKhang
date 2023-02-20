import { Navigate, Outlet } from 'react-router-dom';
import { RootState, useAppSelector } from '../redux/configStore';
import Header from '../components/Header';
import Container from '@mui/material/Container';

const HomeTemplate = () => {
  const { userLogin } = useAppSelector((state: RootState) => state.userReducer);

  if (!userLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          pt: 4,
          pb: { xs: 11, sm: 4 },
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default HomeTemplate;
