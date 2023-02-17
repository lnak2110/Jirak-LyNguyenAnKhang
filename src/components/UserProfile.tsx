import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../redux/configStore';
import ControllerTextField from './ControllerTextField';
import { theme } from '../App';
import Loading from './Loading';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { useMediaQuery } from '@mui/material';
import { EditUserFormInputs } from '../types/userTypes';
import Avatar from '@mui/material/Avatar';
import ControllerPasswordTextField from './ControllerPasswordTextField';
import { editUserAPI } from '../redux/reducers/userReducer';

type UserProfileProps = {
  handleCloseModal?: () => void;
};

const UserProfile = ({ handleCloseModal }: UserProfileProps) => {
  const { currentUserData, isLoading } = useAppSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const schema = yup
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
    reset,
    watch,
    clearErrors,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditUserFormInputs>({
    defaultValues: initialValues,
    shouldFocusError: true,
    mode: 'onTouched',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: EditUserFormInputs) => {
    await dispatch(editUserAPI(data));
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
      {downSm ? (
        <DialogActions
          disableSpacing
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Button
            type="submit"
            form="edit-user-info-form"
            variant="contained"
            fullWidth
            sx={{ mb: 1 }}
            disabled={isSubmitting}
          >
            Update Information
          </Button>
          <Button variant="outlined" fullWidth onClick={handleCloseModal}>
            Cancel
          </Button>
        </DialogActions>
      ) : (
        <DialogActions disableSpacing>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-user-info-form"
            variant="contained"
            sx={{ ml: 2, mr: 4 }}
            disabled={isSubmitting}
          >
            Update Information
          </Button>
        </DialogActions>
      )}
      {isLoading && <Loading />}
    </>
  );
};

export default UserProfile;
