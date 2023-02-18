import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import { CurrentUserDataType, EditUserFormInputs } from '../types/userTypes';
import Avatar from '@mui/material/Avatar';
import ControllerPasswordTextField from './ControllerPasswordTextField';
import { editUserAPI } from '../redux/reducers/userReducer';
import { editUserSchemaYup } from './UserProfile';

type EditUserDialogContentProps = {
  userData: CurrentUserDataType;
  handleCloseModal?: () => void;
};

const EditUserDialogContent = ({
  userData,
  handleCloseModal,
}: EditUserDialogContentProps) => {
  const { isLoading } = useAppSelector((state: RootState) => state.userReducer);

  const dispatch = useAppDispatch();

  const downSm = useMediaQuery(theme.breakpoints.down('sm'));

  const initialValues = useMemo(
    () => ({
      id: userData?.id.toString() || '',
      name: userData?.name || '',
      phoneNumber: userData?.phoneNumber || '',
      email: userData?.email || '',
      password: '',
    }),
    [userData]
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
    dispatch(editUserAPI(data));
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
                alt={userData?.name}
                src={userData?.avatar}
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

export default EditUserDialogContent;
