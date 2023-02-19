import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import { EditUserFormInputs } from '../types/userTypes';
import { editCurrentUserProfileAPI } from '../redux/reducers/userReducer';
import { theme } from '../App';
import ControllerTextField from './ControllerTextField';
import ControllerPasswordTextField from './ControllerPasswordTextField';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Loading from './Loading';
import { useMediaQuery } from '@mui/material';

export const editUserSchemaYup = yup
  .object()
  .shape({
    name: yup.string().trim().required('Name cannot be blank!'),
    email: yup
      .string()
      .trim()
      .required('Email cannot be blank!')
      .email('Email is invalid!'),
    phoneNumber: yup
      .string()
      .trim()
      .required('Phone number cannot be blank!')
      .matches(
        /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
        'Phone number is not valid!'
      ),
    password: yup
      .string()
      .trim()
      .required('Password cannot be blank!')
      .min(4, 'Password must be between 4 - 10 characters!')
      .max(10, 'Password must be between 4 - 10 characters!'),
  })
  .required();

type UserProfileProps = {
  handleCloseModal?: () => void;
};

const UserProfile = ({ handleCloseModal }: UserProfileProps) => {
  const { currentUserData, isLoading } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const initialValues = useMemo(
    () => ({
      id: currentUserData?.id.toString() || '',
      name: currentUserData?.name || '',
      phoneNumber: currentUserData?.phoneNumber || '',
      email: currentUserData?.email || '',
      password: '',
    }),
    [currentUserData]
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EditUserFormInputs>({
    defaultValues: initialValues,
    shouldFocusError: true,
    mode: 'onTouched',
    resolver: yupResolver(editUserSchemaYup),
  });

  const onSubmit = (data: EditUserFormInputs) => {
    dispatch(editCurrentUserProfileAPI(data));
  };

  return (
    <>
      <DialogContent>
        <Box
          id="edit-user-info-form"
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              md={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Avatar
                alt={currentUserData?.name}
                src={currentUserData?.avatar}
                sx={{ height: 64, width: 64 }}
              />
            </Grid>
            <Grid item xs={12} md={10}>
              <ControllerTextField
                control={control}
                name="id"
                label="User ID (read only)"
                readonly
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerTextField control={control} name="name" label="Name" />
            </Grid>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                name="email"
                label="Email"
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerTextField
                control={control}
                name="phoneNumber"
                label="Phone Number"
              />
            </Grid>
            <Grid item xs={12}>
              <ControllerPasswordTextField
                control={control}
                name="password"
                label="Password"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions
        disableSpacing
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          px: 3,
        }}
      >
        <Button
          variant="outlined"
          fullWidth={downSm}
          onClick={handleCloseModal}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-user-info-form"
          variant="contained"
          fullWidth={downSm}
          sx={{
            mb: { xs: 1, sm: 0 },
            ml: { sm: 2 },
            mr: { md: 2 },
          }}
          disabled={isSubmitting}
        >
          Update Information
        </Button>
      </DialogActions>
      {isLoading && <Loading />}
    </>
  );
};

export default UserProfile;
