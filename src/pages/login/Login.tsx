import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useTitle from '../../hooks/useTitle';
import { LoginFormInputs } from '../../types/userTypes';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../redux/configStore';
import { loginAPI } from '../../redux/reducers/userReducer';
import Loading from '../../components/Loading';
import FacebookIcon from '@mui/icons-material/Facebook';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FacebookLogin from '@greatsumini/react-facebook-login';
import image1 from '../../assets/images/login-background-1.jpg';
import image2 from '../../assets/images/login-background-2.jpg';
import image3 from '../../assets/images/login-background-3.jpg';
import image4 from '../../assets/images/login-background-4.jpg';
import image5 from '../../assets/images/login-background-5.jpg';
import image6 from '../../assets/images/login-background-6.jpg';
import image7 from '../../assets/images/login-background-7.jpg';
import image8 from '../../assets/images/login-background-8.jpg';
import image9 from '../../assets/images/login-background-9.jpg';
import image10 from '../../assets/images/login-background-10.jpg';

const loginBackgroundImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];

const randomImage =
  loginBackgroundImages[
    Math.floor(Math.random() * loginBackgroundImages.length)
  ];

const appId = process.env.REACT_APP_FACEBOOK_APP_ID!;

const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .trim()
      .required('Email cannot be blank!')
      .email('Email is invalid!'),
    password: yup
      .string()
      .trim()
      .required('Password cannot be blank!')
      .min(4, 'Password must be between 4 - 10 characters!')
      .max(10, 'Password must be between 4 - 10 characters!'),
  })
  .required();

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading } = useAppSelector((state: RootState) => state.userReducer);

  const dispatch = useAppDispatch();

  useTitle('Login');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormInputs) => {
    dispatch(loginAPI(data));
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${randomImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        square
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h3" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              {...register('email')}
              error={!!errors.email?.message}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="password"
              {...register('password')}
              error={!!errors.password?.message}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
            <Divider>OR</Divider>
            <FacebookLogin
              appId={appId}
              onSuccess={(response) => {
                console.log('Login Success!', response);
              }}
              onFail={(error) => {
                console.log('Login Failed!', error);
              }}
              render={({ onClick }) => (
                <Button
                  type="button"
                  disabled={isSubmitting}
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  sx={{ my: 2 }}
                  onClick={onClick}
                >
                  Log in with Facebook
                </Button>
              )}
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={NavLink} to="/register" variant="body2">
                  Don't have an account? Register now!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      {isLoading && <Loading />}
    </Grid>
  );
};

export default Login;
